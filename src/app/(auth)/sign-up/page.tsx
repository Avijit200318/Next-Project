"use client";
import React, { useEffect, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from 'next/link';
import { useDebounceValue, useDebounceCallback } from 'usehooks-ts'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from 'next/navigation';
import { signUpSchema } from '@/schemas/singUpSchema';
import axios, { AxiosError } from "axios";
import { ApiResponse } from '@/types/ApiResponse';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from "@/components/ui/button"
import { Loader2 } from 'lucide-react';

export default function signin() {
  const [username, setUsername] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast()
  const router = useRouter();
  const debounce = useDebounceCallback(setUsername, 300);

  // zod implementation
  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: ''
    }
  });

  useEffect(() => {
    const checkUniqueUsername = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage('');
        try {
          const res = await fetch(`/api/check-username-unique?username=${username}`);
          const data = await res.json();
          if (data.success === false) {
            console.log("data error: ", data.message);
            setUsernameMessage(data.message);
            return;
          }
          setUsernameMessage(data.message);

        } catch (error: any) {
          console.log("error: ", error.message);
          setUsernameMessage(error.message);
        } finally {
          setIsCheckingUsername(false);
        }
      }
    }

    checkUniqueUsername();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const res = await axios.post<ApiResponse>('/api/sign-up', {
        data
      });
      toast({
        title: 'Success',
        description: res.data.message
      })
      router.replace(`/verify/${username}`);
      setIsSubmitting(false);
    } catch (error) {
      console.log("error in signup: ", error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;
      toast({
        title: "Signup failed",
        description: errorMessage,
        variant: "destructive"
      });
      setIsSubmitting(false);
    }
  }

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">Join Mystery Message</h1>
          <p className="mb-4">Sign up to start you anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="username"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e)
                        debounce(e.target.value)
                      }}
                    />
                  </FormControl>
                  {isCheckingUsername && <Loader2 className='animate-spin'/>}
                  <p className={`text-sm ${usernameMessage === "Username is unique" ? 'text-green-500' : 'text-red-500'}`}>
                    text {usernameMessage}
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type='password' placeholder="Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" aria-disabled={isSubmitting}>
              {isSubmitting? <><Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please Wait</> : 'SignUp'}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Already a member?{''}
            <Link href='/sign-in' className='text-blue-600 hover:text-blue-800'>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
