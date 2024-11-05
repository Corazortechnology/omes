import React from 'react';
import { Link } from 'react-router-dom';

// You'll need to import your logo image
// import Logo from './assets/img/Logo.png';

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-md">
        <nav className="px-4 py-2">
          <div className="container mx-auto flex items-center justify-between">
            <img 
              className="h-12 w-auto"
              src="/img/Logo.png" 
              alt="Omegle Logo" 
            />
            <h2 className="text-xl font-semibold">Talk to stranger</h2>
            <div className="text-green-600">5000+ online now</div>
          </div>
        </nav>
      </header>

      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          <p className="mb-4">
            You don't need an app to use Omegle on your phone or tablet! The web site works great on mobile.
          </p>
          
          <p className="mb-4">
            Omegle (oh·meg·ull) is a great way to meet new friends, even while practicing social distancing. 
            When you use Omegle, you are paired randomly with another person to talk one-on-one. 
            If you prefer, you can add your interests and you'll be randomly paired with someone who 
            selected some of the same interests.
          </p>

          <p className="mb-4">
            To help you stay safe, chats are anonymous unless you tell someone who you are (not recommended!), 
            and you can stop a chat at any time. See our Terms of Service and Community Guidelines for more 
            info about the do's and don'ts in using Omegle. Omegle video chat is moderated but no moderation 
            is perfect. Users are solely responsible for their behavior while using Omegle.
          </p>

          <p className="mb-4">
            YOU MUST BE 18 OR OLDER TO USE OMEGLE. See Omegle's Terms of Service for more info. 
            Parental control protections that may assist parents are commercially available and you 
            can find more info at https://www.connectsafely.org/controls/ as well as other sites.
          </p>

          <p className="mb-6">
            Please leave Omegle and visit an adult site instead if that's what you're looking for, 
            and you are 18 or older.
          </p>

          <h2 className="text-red-600 text-xl font-bold mb-6 text-center">
            Video is monitored. Keep it clean
          </h2>

          <div className="text-center">
            <p className="text-xl font-semibold mb-4">Start Chatting</p>
            <div className="flex justify-center gap-4">
              <Link 
                to="/text_chat"
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
              >
                Text Chat
              </Link>
              <Link 
                to="/video_chat"
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
              >
                Video Chat
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;