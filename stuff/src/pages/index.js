import { useRouter } from 'next/router';
import Button from '../components/Button'

export default function Login() {
    const router = useRouter();

    const handleLogin = () => {
        // do login stuff
        router.push("/home");
    }
    return (
      <div className="">
        <h1>Login</h1>
        <Button onClick={handleLogin} label="Login" size="medium"/>
      </div>
    );
  }