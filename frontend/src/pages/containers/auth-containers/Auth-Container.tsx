import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SingIn from '@/pages/containers/auth-containers/components/SingIn';
import SingUp from '@/pages/containers/auth-containers/components/SingUp';


const AuthContainers = () => {
  return (
    <div className="flex max-w-sm flex-col gap-6 mx-auto pt-20">
      <Tabs defaultValue="sing_in">
        <TabsList className='w-full'>
          <TabsTrigger value="sing_up">Sing Up</TabsTrigger>
          <TabsTrigger value="sing_in">Sing In</TabsTrigger>
        </TabsList>
        <TabsContent value="sing_up">
          <SingUp />
        </TabsContent>
        <TabsContent value="sing_in">
          <SingIn />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuthContainers;
