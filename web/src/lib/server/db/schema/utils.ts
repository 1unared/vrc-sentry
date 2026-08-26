import { customType } from 'drizzle-orm/pg-core';
import { Encryption } from '@adonisjs/encryption';

import { env } from '$env/dynamic/private';

if (!env.ENCRYPTION_KEY) {
	throw new Error('ENCRYPTION_KEY is not defined in your environment variables.');
}

const encryption = new Encryption({
  secret: env.ENCRYPTION_KEY,
  algorithm: 'aes-256-cbc'
});

export const encryptedText = customType<{ data: string }>({
  dataType() { return 'text'; },
  fromDriver(value) {
    const decrypted = encryption.decrypt(value);
    if (decrypted === null) {
      throw new Error('Failed to decrypt value from database');
    }
    return decrypted as string;
  },
  toDriver(value) { return encryption.encrypt(value); },
});
