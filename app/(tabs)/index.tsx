import { Task } from '@/interfaces/tasks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HeaderTitle } from '@react-navigation/elements';
import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

export default function TasksScreen() {
    const [text, setText] = useState<string>('');
    const [tasks, setTasks] = useState<Task[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);

    useEffect(() => {
        const loadTasks = async () => {
            try {
                const storedTasks = await AsyncStorage.getItem('tasks');
                if (storedTasks) {
                    setTasks(JSON.parse(storedTasks));
                }
            } catch (error) {
                console.error('Error loading tasks', error);
            }
        }
        loadTasks();
    }, []);

    useEffect(() => {
        const saveTasks = async () => {
            try {
                await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
            } catch (error) {
                console.error('Error saving tasks', error);
            }
        };
        saveTasks();
    }, [tasks]);

    const addOrUpdateTask = () => {
        if (!text.trim()) return;

        if (editingId) {
            setTasks(prev =>
                prev.map(task =>
                    task.id === editingId ? { ...task, title: text } : task
                )
            );
            setEditingId(null);
        } else {
            setTasks([...tasks, { id: Date.now().toString(), title: text, completed: false }]);
        }

        setText('');
    };

    const deleteTask = (id: string) => {
        setTasks(tasks.filter(t => t.id !== id));
        if (editingId === id) {
            setEditingId(null);
            setText('');
        }
    };

    const editTask = (task: Task) => {
        setText(task.title);
        setEditingId(task.id);
    };

    const toggleComplete = (id: string) => {
        setTasks(prev =>
            prev.map(task =>
                task.id === id ? { ...task, completed: !task.completed } : task
            )
        );
    };

    return (
        <View style={styles.container}>
            <HeaderTitle style={styles.headerTitle}>Task List</HeaderTitle>
            <TextInput
                value={text}
                onChangeText={setText}
                placeholder='New task'
                style={styles.input}
            />
            <Button
                color={editingId ? "#ffa500" : "#333"}
                title={editingId ? "Update Task" : "Add Task"}
                onPress={addOrUpdateTask}
            />
            <FlatList
                style={styles.flatList}
                data={tasks}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={styles.task}>
                        <Text style={styles.textTask}>
                            {item.title}
                        </Text>
                        <View style={styles.buttons}>
                            <Button
                                color={item.completed ? "#999" : "#0a0"}
                                title={item.completed ? "Undo" : "Complete"}
                                onPress={() => toggleComplete(item.id)}
                            />
                            <Button color="#222" title="Edit" onPress={() => editTask(item)} />
                            <Button color="#f00" title="Delete" onPress={() => deleteTask(item.id)} />
                        </View>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { padding: 16 },
    headerTitle: { color: '#fff', fontSize: 24, marginBottom: 20, height: 40 },
    input: {
        backgroundColor: '#fff',
        borderColor: '#ccc',
        borderWidth: 1,
        padding: 8,
        marginBottom: 12,
        borderRadius: 5,
    },
    flatList: {
        marginTop: 12,
    },
    task: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
        backgroundColor: '#444',
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
    },
    textTask: {
        color: '#ccc',
        flex: 1,
        textDecorationLine: 'none',
    },
    completedText: {
        textDecorationLine: 'line-through',
        color: '#888',
    },
    buttons: {
        flexDirection: 'row',
        gap: 6,
    }
});
