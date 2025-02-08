'use client';

const clientId = process.env.NEXT_PUBLIC_GITHUB_APP_CLIENT_ID;
console.log(clientId);
export default function Login() {
  const handleGitHubAppInstall = () => {
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=read:user,repo`;
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <button
        onClick={handleGitHubAppInstall}
        className="bg-black text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-gray-800 transition"
      >
        Sign in with GitHub
      </button>
    </div>
  );
}
