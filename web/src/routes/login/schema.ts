import { z } from 'zod';

export const loginSchema = z.object({
	uuid: z
    .string()
		.min(1, { message: 'UUID is required' })
		.transform((val) => val.replace(/^usr_/, ''))
		.pipe(z.uuid({ message: 'Invalid UUID format' })),
	password: z.string().min(1, { message: 'Password is required' })
});

export type FormSchema = typeof loginSchema;
