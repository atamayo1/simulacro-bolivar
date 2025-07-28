import { User } from '@/interfaces/users';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, FlatList, StyleSheet, Text, View } from 'react-native';

export default function UsersScreen() {
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();

    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/users')
            .then((response) => response.json())
            .then((data) => {
                setUsers(data);
                setLoading(false);
            })
            .catch((error) => console.error(error));
    }, [])

    return (
        <View style={styles.container}>
            {
                loading ? (
                    <ActivityIndicator size="large" color="#333" />
                ) : (
                    <FlatList
                        data={users}
                        keyExtractor={item => String(item.id)}
                        renderItem={(item) => (
                            <View style={styles.users}>
                                <View style={styles.headerUser}>
                                    <Text style={styles.nameUser}>
                                        {item.item.name}
                                    </Text>
                                    <Text style={styles.emailUser}>
                                        {item.item.email}
                                    </Text>
                                </View>
                                <Button color="#333" title="Go to detail" onPress={() => router.push({ pathname: '/details', params: { id: String(item.item.id) } })} />
                            </View>
                        )}
                    />
                )
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 17 },
    users: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, backgroundColor: '#555', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 5 },
    headerUser: { padding: 17, borderRadius: 5 },
    nameUser: { color: '#ccc' },
    emailUser: { color: '#aaa', textTransform: 'lowercase' },
})