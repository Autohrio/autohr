import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ProfileSection = () => {
  return (
    <div className="space-y-6 w-1/2">
      <h2 className="text-2xl font-bold">Profile</h2>
      <p className="text-gray-600">This is how others will see you on the site.</p>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Username</label>
          <Input placeholder="John Doe" className="mt-1" />
          <p className="mt-1 text-sm text-gray-500">This is your public display name. It can be your real name or a pseudonym. You can only change this once every 30 days.</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <Select>
            <SelectTrigger className="w-full mt-1">
              <SelectValue placeholder="Select a verified email to display" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="email1">john@example.com</SelectItem>
              <SelectItem value="email2">john2@example.com</SelectItem>
            </SelectContent>
          </Select>
          <p className="mt-1 text-sm text-gray-500">You can manage verified email addresses in your email settings.</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Bio</label>
          <Textarea placeholder="I own a computer." className="mt-1" />
          <p className="mt-1 text-sm text-gray-500">You can @mention other users and organizations to link to them.</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">URLs</label>
          <p className="text-sm text-gray-500">Add links to your website, blog, or social media profiles.</p>
          <Input placeholder="https://johndoe.com" className="mt-1" />
          <Input placeholder="http://x.com/johndoe" className="mt-2" />
          <Button variant="outline" className="mt-2">Add URL</Button>
        </div>
      </div>
      
      <Button className="mt-6">Update profile</Button>
    </div>
  );
};

export default ProfileSection