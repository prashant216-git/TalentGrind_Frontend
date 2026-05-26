// src/routes/signup.tsx

import { createFileRoute } from '@tanstack/react-router';
import AuthForm from '../components/AuthForm';

export const Route = createFileRoute('/signup')({
  component: SignupComponent,
});

function SignupComponent() {
  return <AuthForm mode="signup" />;
}
