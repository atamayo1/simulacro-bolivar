import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

export default function TasksScreen() {
    const [text, setText] = useState<string>('');
    const [tasks, setTasks] = useState<{ id: string, title: string }[]>([]);

    const addTask = () => {
        if (!text.trim()) return;
        setTasks([...tasks, { id: Date.now().toString(), title: text }]);
        setText('');
    }

    const deleteTask = (id: string) => {
        setTasks(tasks.filter(t => t.id !== id));
    }

    return (
        <View style={styles.container}>
            <TextInput value={text} onChangeText={setText} placeholder='New task' style={styles.input}></TextInput>
            <Button color="#333" title="Add" onPress={addTask} />
            <br />
            <FlatList
                data={tasks}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={styles.task}>
                        <Text style={styles.textTask}>{item.title}</Text>
                        <Button color="#f00" title="Delete" onPress={() => deleteTask(item.id)} />
                    </View>
                )}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: { padding: 16 },
    input: { backgroundColor: '#fff', borderColor: '#ccc', borderWidth: 1, padding: 8, marginBottom: 12, borderRadius: 5 },
    task: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    textTask: { color: '#ccc' }
})