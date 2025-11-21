export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-6xl font-bold mb-6">
          Stay curious.
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Discover stories, thinking, and expertise from writers on any topic.
        </p>
        <button className="bg-black text-white px-8 py-3 rounded-full text-lg hover:bg-gray-800">
          Start reading
        </button>
      </div>

      {/* Placeholder for posts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
            <div className="h-48 bg-gray-200 rounded mb-4"></div>
            <h3 className="text-xl font-bold mb-2">Sample Post Title</h3>
            <p className="text-gray-600 mb-4">
              This is a preview of a blog post. Click to read more...
            </p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              <span className="text-sm text-gray-500">Author Name</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}