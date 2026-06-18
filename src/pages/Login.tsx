import { HeroSection } from '../components/HeroSection.tsx'; 
import { LoginForm } from '../components/LoginForm.tsx';

function Login() {
    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-brand-pink to-brand-red flex flex-col lg:flex-row items-center justify-between px-8 lg:px-20 py-10 gap-10">

            {/* left side - Branding */}
            <HeroSection />

            {/* right side - Form */}
            <LoginForm />

        </div>
    );
}

export default Login;