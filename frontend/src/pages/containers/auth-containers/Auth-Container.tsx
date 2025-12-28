import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SignIn from '@/pages/containers/auth-containers/components/SignIn';
import SignUp from '@/pages/containers/auth-containers/components/SignUp';

const AuthContainers = () => {
  return (
    <div className="flex max-w-sm flex-col gap-6 mx-auto pt-20">
      <Tabs defaultValue="sign_in">
        <TabsList className="w-full">
          <TabsTrigger value="sign_up">Sign Up</TabsTrigger>
          <TabsTrigger value="sign_in">Sign In</TabsTrigger>
        </TabsList>

        <TabsContent value="sign_up">
          <SignUp />
        </TabsContent>

        <TabsContent value="sign_in">
          <SignIn />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuthContainers;
