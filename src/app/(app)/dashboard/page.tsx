"use client";
import React from 'react'
import { signOut } from "next-auth/react"


export default function page() {

    return (
        <div>
            <h1 className="my-4">This is the dashboard page</h1>

            {/* in next auth there is an inbuild signout function. We have to use it. Instead of doing it maually */}
            <button onClick={() => signOut()}>Sign out</button>
        </div>
    )
}
