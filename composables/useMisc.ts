import { useToast } from 'vue-toastification';

export default function () {
    const loading = useState('loading', () => false);
    const toast = useToast();

    return {
        loading,
        toast,
    };
}
