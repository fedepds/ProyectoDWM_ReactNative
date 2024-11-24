import {Redirect} from 'expo-router';
import { useToken } from "@/context/TokenContext";

export default function NotFoundScreen() {
    const token = useToken();
    
    return token ? <Redirect to="/(tabs)" /> : <Redirect to="/unAuth" />;
    }
