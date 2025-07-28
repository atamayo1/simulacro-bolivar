import { User } from '@/interfaces/users';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export default function Details() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!id) return;

        fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
            .then(res => res.json())
            .then(data => {
                setUser(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return <ActivityIndicator size="large" color="#333" style={styles.centered} />;
    }

    if (!user) {
        return <Text style={styles.centered}>User not found</Text>;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{user.name}</Text>
            <Text style={styles.text}>Email: {user.email}</Text>
            <Text style={styles.text}>Username: {user.username}</Text>
            <Text style={styles.text}>Phone: {user.phone}</Text>
            <Text style={styles.text}>Website: {user.website}</Text>
            <Text style={styles.text}>Company: {user.company?.name}</Text>
            <Text style={styles.text}>City: {user.address?.city}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        gap: 10,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#ccc'
    },
    text: {
        fontSize: 14,
        marginBottom: 2,
        color: '#aaa'
    },
    centered: {
        flex: 1,
        textAlign: 'center',
        textAlignVertical: 'center'
    }
});