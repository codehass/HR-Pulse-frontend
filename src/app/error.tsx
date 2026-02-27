"use client";

import React, { useEffect } from "react";

interface ErrProps {
	err: Error & { digest?: string };
	reset: () => void;
}

export default function ErrorPage({ err, reset }: ErrProps) {
	// Log the error to an error reporting service like Sentry or LogRocket
	useEffect(() => {
		console.error("App-level Error Caught:", err);
	}, [err]);

	return (
		<div className="flex flex-col items-center justify-center h-screen bg-red-50 text-red-800">
			<h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
			<p className="mb-6">An unexpected error occurred. Please try again.</p>
			<button
				className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
				onClick={() => reset()}
			>
				Try Again
			</button>
		</div>
	);
}
