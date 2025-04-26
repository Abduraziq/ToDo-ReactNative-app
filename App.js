import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const TodoApp = () => {
  const [tasks, setTasks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentTask, setCurrentTask] = useState({ title: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load tasks');
    }
  };

  const saveTasks = async (newTasks) => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(newTasks));
    } catch (error) {
      Alert.alert('Error', 'Failed to save tasks');
    }
  };

  const addTask = () => {
    if (currentTask.title.trim() === '') {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    const newTask = {
      id: Date.now().toString(),
      title: currentTask.title,
      completed: false,
    };

    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    setCurrentTask({ title: '' });
    setModalVisible(false);
  };

  const updateTask = () => {
    if (currentTask.title.trim() === '') {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    const updatedTasks = tasks.map(task =>
      task.id === editingId
        ? { ...task, title: currentTask.title }
        : task
    );

    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    setCurrentTask({ title: '' });
    setEditingId(null);
    setModalVisible(false);
  };

  const deleteTask = (id) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: () => {
            const updatedTasks = tasks.filter(task => task.id !== id);
            setTasks(updatedTasks);
            saveTasks(updatedTasks);
          },
          style: 'destructive'
        }
      ]
    );
  };

  const toggleTask = (id) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setCurrentTask({ title: task.title });
    setModalVisible(true);
  };

  const TaskItem = ({ item }) => (
    <View style={[styles.taskCard, item.completed && styles.completedTaskCard]}>
      <TouchableOpacity
        style={styles.taskLeft}
        onPress={() => toggleTask(item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.iconContainer}>
          <Icon
            name={item.completed ? 'checkbox-marked-circle-outline' : 'checkbox-blank-circle-outline'}
            size={24}
            color={item.completed ? '#28a745' : '#6B4EFF'}
          />
        </View>
        <Text style={styles.taskTitle}>{item.title}</Text>
      </TouchableOpacity>

      <View style={styles.taskRight}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => startEdit(item)}
        >
          <Icon name="pencil" size={20} color="#6B4EFF" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteTask(item.id)}
        >
          <Icon name="trash-can-outline" size={20} color="#FF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.title}>My Todo List App</Text>
      </View>

      <FlatList
        data={tasks.filter(task => !task.completed)}
        renderItem={({ item }) => <TaskItem item={item} />}
        keyExtractor={item => item.id}
        style={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No active tasks</Text>
        }
      />

      {tasks.some(task => task.completed) && (
        <>
          <Text style={styles.sectionTitle}>Completed</Text>
          <FlatList
            data={tasks.filter(task => task.completed)}
            renderItem={({ item }) => <TaskItem item={item} />}
            keyExtractor={item => item.id}
            style={styles.list}
          />
        </>
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          setEditingId(null);
          setCurrentTask({ title: '' });
          setModalVisible(true);
        }}
      >
        <Text style={styles.addButtonText}>Add New Task</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingId ? 'Edit Task' : 'Add New Task'}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Task title"
              value={currentTask.title}
              onChangeText={(text) => setCurrentTask({ ...currentTask, title: text })}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={editingId ? updateTask : addTask}
              >
                <Text style={styles.saveButtonText}>
                  {editingId ? 'Update' : 'Add'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#6B4EFF' },
  header: { padding: 20, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#FFF' },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#FFF', marginHorizontal: 20, marginTop: 20, marginBottom: 10 },
  list: { paddingHorizontal: 20 },
  taskCard: { backgroundColor: '#FFF', borderRadius: 15, padding: 15, marginBottom: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', elevation: 2 },
  completedTaskCard: { backgroundColor: 'rgba(255, 255, 255, 0.9)' },
  taskLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  taskRight: { flexDirection: 'row', alignItems: 'center' },
  iconContainer: { width: 40, height: 40, backgroundColor: '#F0EEFF', borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  taskTitle: { fontSize: 16, fontWeight: '500', color: '#1A1A1A' },
  emptyText: { textAlign: 'center', color: '#FFF', fontSize: 18, marginTop: 20 },
  addButton: { backgroundColor: '#FFF', borderRadius: 30, paddingVertical: 15, marginVertical: 20, marginHorizontal: 20, justifyContent: 'center', alignItems: 'center', elevation: 4 },
  addButtonText: { fontSize: 18, fontWeight: 'bold', color: '#6B4EFF' },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: '#FFF', padding: 20, borderRadius: 10, width: '80%', alignItems: 'center' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#6B4EFF', marginBottom: 15 },
  input: { width: '100%', borderWidth: 1, borderColor: '#DDD', borderRadius: 5, padding: 10, marginBottom: 15, fontSize: 16 },
  modalButtons: { flexDirection: 'row', width: '100%', justifyContent: 'space-between' },
  modalButton: { flex: 1, paddingVertical: 12, borderRadius: 5, marginHorizontal: 5, alignItems: 'center' },
  cancelButton: { backgroundColor: '#FF4444' },
  saveButton: { backgroundColor: '#6B4EFF' },
  cancelButtonText: { color: '#FFF', fontWeight: 'bold' },
  saveButtonText: { color: '#FFF', fontWeight: 'bold' },
  editButton: { padding: 10 },
  deleteButton: { padding: 10 },
});

export default TodoApp;
