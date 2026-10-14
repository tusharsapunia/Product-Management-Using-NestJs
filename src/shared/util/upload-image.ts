import { Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../../external/supabase/supabase.provider.js';

@Injectable()
export class image {
  constructor(
    @Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient,
  ) {}

  async uploadImage(image: Express.Multer.File) {
    const filePath = `${Date.now()}-${image.originalname}`;
    const { data: uploadedFile, error } = await this.supabase.storage
      .from(process.env.SUPABASE_BUCKET!)
      .upload(filePath, image.buffer, {
        contentType: image.mimetype,
      });

    if (error) {
      throw new Error(error.message);
    }

    const imageUrl = await this.supabase.storage
      .from(process.env.SUPABASE_BUCKET!)
      .getPublicUrl(uploadedFile.path).data.publicUrl;

    return imageUrl;
  }
}
