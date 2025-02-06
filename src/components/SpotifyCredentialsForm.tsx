import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { setSpotifyCredentials } from '../utils/spotify';

interface SpotifyCredentialsFormProps {
  onCredentialsSet: () => void;
}

const SpotifyCredentialsForm = ({ onCredentialsSet }: SpotifyCredentialsFormProps) => {
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSpotifyCredentials(clientId, clientSecret);
    onCredentialsSet();
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white/10 backdrop-blur-xl rounded-xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="clientId" className="block text-sm font-medium text-white mb-1">
            Spotify Client ID
          </label>
          <Input
            id="clientId"
            type="text"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            required
            className="w-full"
            placeholder="Enter your Spotify Client ID"
          />
        </div>
        <div>
          <label htmlFor="clientSecret" className="block text-sm font-medium text-white mb-1">
            Spotify Client Secret
          </label>
          <Input
            id="clientSecret"
            type="password"
            value={clientSecret}
            onChange={(e) => setClientSecret(e.target.value)}
            required
            className="w-full"
            placeholder="Enter your Spotify Client Secret"
          />
        </div>
        <Button type="submit" className="w-full">
          Set Credentials
        </Button>
      </form>
    </div>
  );
};

export default SpotifyCredentialsForm;