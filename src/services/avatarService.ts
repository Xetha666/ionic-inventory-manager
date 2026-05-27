import { supabase } from './supabaseClient';

/**
 * Convierte una imagen en formato Base64 a un archivo binario Blob,
 * la sube a Supabase Storage en el bucket 'avatars' bajo la carpeta del usuario,
 * obtiene su URL pública y actualiza el perfil en PostgreSQL.
 * 
 * @param userId UUID del usuario
 * @param base64Image String base64 de la imagen recortada (Data URL)
 * @returns Promesa con la URL pública del avatar subido
 */
export const uploadAvatar = async (userId: string, base64Image: string): Promise<string> => {
  // 1. Convertir Base64 (Data URL) a Blob
  const response = await fetch(base64Image);
  const blob = await response.blob();

  // 2. Limpiar archivos antiguos en la carpeta del usuario para evitar basura (ej. avatar.png anterior)
  try {
    const { data: existingFiles } = await supabase.storage
      .from('avatars')
      .list(userId);

    if (existingFiles && existingFiles.length > 0) {
      const filesToDelete = existingFiles
        .filter((file) => file.name !== 'avatar.webp') // Conservar el nuevo webp si ya existe para sobrescribirlo mediante upsert
        .map((file) => `${userId}/${file.name}`);

      if (filesToDelete.length > 0) {
        await supabase.storage.from('avatars').remove(filesToDelete);
      }
    }
  } catch (err) {
    console.warn('No se pudieron limpiar los archivos antiguos del Storage:', err);
  }

  // 3. Definir la ruta del archivo en el bucket (avatars/{userId}/avatar.webp)
  const filePath = `${userId}/avatar.webp`;

  // 4. Subir el Blob a Supabase Storage con upsert: true para sobreescribir si ya existe
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, blob, {
      contentType: 'image/webp',
      upsert: true,
    });

  if (uploadError) {
    throw new Error(`Error al subir la imagen al Storage: ${uploadError.message}`);
  }

  // 4. Obtener la URL pública de la imagen recién subida
  const { data } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath);

  if (!data || !data.publicUrl) {
    throw new Error('No se pudo generar la URL pública de la imagen subida.');
  }

  const publicUrl = data.publicUrl;

  // 5. Actualizar la columna avatar_url en la tabla de perfiles de la BD
  const { error: dbError } = await supabase
    .from('profiles')
    .update({ avatar_url: publicUrl })
    .eq('id', userId);

  if (dbError) {
    throw new Error(`Error al actualizar el perfil en la base de datos: ${dbError.message}`);
  }

  return publicUrl;
};
