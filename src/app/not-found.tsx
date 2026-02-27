import Link from "next/link";

export default function NotFound() {
	return (
		<div className="flex flex-col items-center justify-center h-screen bg-white text-gray-800">
			<h1 className="text-9xl font-extrabold text-red-500">404</h1>
			<h2 className="text-3xl font-semibold mt-4 mb-2">Page Not Found</h2>
			<p className="mb-8 text-lg">
				We could not find the page you were looking for.
			</p>
			<Link
				href="/"
				className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
			>
				Go back home
			</Link>
		</div>
	);
}
