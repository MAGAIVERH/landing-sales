'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const heroLeadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Digite seu nome')
    .max(80)
    .optional()
    .or(z.literal('')),
  email: z.string().trim().email('Digite um e-mail válido'),
  phone: z.string().trim().max(30).optional().or(z.literal('')),
});

type HeroLeadValues = z.infer<typeof heroLeadSchema>;

export const HeroLeadForm = () => {
  const router = useRouter();

  const form = useForm<HeroLeadValues>({
    resolver: zodResolver(heroLeadSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
    },
    mode: 'onTouched',
  });

  const onSubmit = (values: HeroLeadValues) => {
    const params = new URLSearchParams();

    if (values.name?.trim()) params.set('name', values.name.trim());
    if (values.email?.trim()) params.set('email', values.email.trim());
    if (values.phone?.trim()) params.set('phone', values.phone.trim());

    router.push(`/budget?${params.toString()}`);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-4'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-sm font-medium'>
                Nome completo
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder='Digite seu nome completo'
                  className='h-11'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-sm font-medium'>
                E-mail profissional
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type='email'
                  placeholder='Digite seu melhor e-mail'
                  className='h-11'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='phone'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-sm font-medium'>WhatsApp</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder='(00) 00000-0000'
                  className='h-11'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type='submit'
          className='h-11 w-full bg-primary text-primary-foreground hover:bg-primary/90'
          disabled={form.formState.isSubmitting}
        >
          Avançar para próximo passo
        </Button>
      </form>
    </Form>
  );
};
