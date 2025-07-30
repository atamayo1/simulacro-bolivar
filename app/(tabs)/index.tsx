import { Task } from '@/interfaces/tasks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HeaderTitle } from '@react-navigation/elements';
import React, { useEffect, useState } from 'react';
import { Button, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

export default function TasksScreen() {
    const [text, setText] = useState('');
    const [tasks, setTasks] = useState<Task[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>(() => new Date().toISOString().split('T')[0]);

    useEffect(() => {
        const loadTasks = async () => {
            try {
                const storedTasks = await AsyncStorage.getItem('tasks');
                if (storedTasks) {
                    let tasksSorted = JSON.parse(storedTasks).sort((a: Task, b: Task) =>
                        new Date(a.dueDate ?? '').getTime() - new Date(b.dueDate ?? '').getTime()
                    );
                    setTasks(tasksSorted);
                }
            } catch (error) {
                console.error('Error loading tasks', error);
            }
        };
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
                    task.id === editingId ? { ...task, title: text, dueDate: selectedDate } : task
                )
            );
            setEditingId(null);
        } else {
            setTasks([...tasks, {
                id: Date.now().toString(),
                title: text,
                completed: false,
                dueDate: selectedDate,
            }]);
        }

        setText('');
        setSelectedDate(new Date().toISOString().split('T')[0]);
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
        setSelectedDate(task.dueDate || new Date().toISOString().split('T')[0]);
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
                placeholder="New task"
                style={styles.input}
            />
            {/* Fecha (en web usamos input nativo HTML) */}
            <View style={styles.dateSection}>
                <Text style={styles.dateLabel}>Due Date:</Text>
                {Platform.OS === 'web' ? (
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        style={styles.webDateInput as React.CSSProperties}
                    />
                ) : (
                    <TextInput
                        value={selectedDate}
                        editable={false}
                        style={styles.input}
                    />
                )}
            </View>
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
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.textTask]}>
                                {item.title}
                            </Text>
                            {item.dueDate && (
                                <Text style={styles.dueDate}>Due: {item.dueDate}</Text>
                            )}
                        </View>
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
    dateSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 12,
    },
    dateLabel: {
        color: '#ccc',
        fontSize: 16,
    },
    webDateInput: {
        padding: 8,
        borderRadius: 5,
        borderColor: '#ccc',
        borderWidth: 1,
        fontSize: 16,
    },
    flatList: {
        marginTop: 12,
        height: 500,
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
        textDecorationLine: 'none',
    },
    completedText: {
        textDecorationLine: 'line-through',
        color: '#888',
    },
    dueDate: {
        color: '#aaa',
        fontSize: 12,
    },
    buttons: {
        flexDirection: 'column',
        gap: 4,
    },
});
