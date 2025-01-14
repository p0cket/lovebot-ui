// import React, { useState } from 'react';
// import { Search } from 'lucide-react';
// import { Card, CardContent } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';

// // location(url), request (info sent), response(info)
// // access token is pretty much API key.
// // https://developers.google.com/youtube/v3/docs/search/list

// // Mock video data
// const mockVideos = [
//   {
//     id: '1',
//     title: 'Learning React in 2024',
//     channel: 'Code Masters',
//     views: '125K views',
//     thumbnail: '/api/placeholder/320/180',
//     duration: '15:30'
//   },
//   {
//     id: '2',
//     title: 'Web Development Full Course',
//     channel: 'Tech Academy',
//     views: '250K views',
//     thumbnail: '/api/placeholder/320/180',
//     duration: '45:20'
//   },
//   {
//     id: '3',
//     title: 'JavaScript Tips and Tricks',
//     channel: 'JS Ninja',
//     views: '75K views',
//     thumbnail: '/api/placeholder/320/180',
//     duration: '10:15'
//   }
// ];

// const YouTubePlayer = () => {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedVideo, setSelectedVideo] = useState(null);
//   const [videos, setVideos] = useState(mockVideos);

//   const handleSearch = () => {
//     // In a real app, this would call YouTube API
//     console.log('Searching for:', searchQuery);
//   };

//   return (
//     <div className="w-full max-w-4xl mx-auto p-4 space-y-4">
//       {/* Search Bar */}
//       <div className="flex gap-2">
//         <Input
//           type="text"
//           placeholder="Search videos..."
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           className="flex-1"
//         />
//         <Button onClick={handleSearch}>
//           <Search className="w-4 h-4 mr-2" />
//           Search
//         </Button>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         {/* Video Player */}
//         {selectedVideo && (
//           <div className="col-span-full">
//             <Card>
//               <CardContent className="p-4">
//                 <div className="relative bg-gray-900 aspect-video rounded-lg overflow-hidden">
//                   <img
//                     src="/api/placeholder/640/360"
//                     alt={selectedVideo.title}
//                     className="w-full h-full object-cover"
//                   />
//                   <div className="absolute bottom-4 right-4 bg-black bg-opacity-75 px-2 py-1 rounded text-white text-sm">
//                     {selectedVideo.duration}
//                   </div>
//                 </div>
//                 <h2 className="text-xl font-bold mt-4">{selectedVideo.title}</h2>
//                 <p className="text-gray-600">{selectedVideo.channel} • {selectedVideo.views}</p>
//               </CardContent>
//             </Card>
//           </div>
//         )}

//         {/* Video List */}
//         {videos.map((video) => (
//           <Card
//             key={video.id}
//             className="cursor-pointer hover:shadow-lg transition-shadow"
//             onClick={() => setSelectedVideo(video)}
//           >
//             <CardContent className="p-4">
//               <div className="relative">
//                 <img
//                   src={video.thumbnail}
//                   alt={video.title}
//                   className="w-full aspect-video object-cover rounded-lg"
//                 />
//                 <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 px-2 py-1 rounded text-white text-sm">
//                   {video.duration}
//                 </div>
//               </div>
//               <h3 className="font-semibold mt-2 line-clamp-2">{video.title}</h3>
//               <p className="text-sm text-gray-600">{video.channel}</p>
//               <p className="text-sm text-gray-500">{video.views}</p>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default YouTubePlayer;