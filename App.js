
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  SafeAreaView,
  StatusBar,
  Modal,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const TodoApp = () => {
  const [tasks, setTasks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentTask, setCurrentTask] = useState({ title: '' });
  const [editingId, setEditingId] = useState(null);

  // Load tasks from AsyncStorage
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

  // Save tasks to AsyncStorage
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
      icon: 'checkbox-blank-circle-outline' // Default icon
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
    <TouchableOpacity
      style={[styles.taskCard, item.completed && styles.completedTaskCard]}
      onPress={() => toggleTask(item.id)}
    >
      <View style={styles.taskLeft}>
        <View style={styles.iconContainer}>
          <Icon name={item.icon} size={20} color="#6B4EFF" />
        </View>
        <View>
          <Text style={styles.taskTitle}>{item.title}</Text>
        </View>
      </View>
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
        <TouchableOpacity
          style={[styles.checkbox, item.completed && styles.checkedBox]}
          onPress={() => toggleTask(item.id)}
        >
          {item.completed && <Icon name="check" size={16} color="#FFF" />}
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Todo List App</Text>
      </View>

      {/* Active Tasks */}
      <FlatList
        data={tasks.filter(task => !task.completed)}
        renderItem={({ item }) => <TaskItem item={item} />}
        keyExtractor={item => item.id}
        style={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No active tasks</Text>
        }
      />

      {/* Completed Section */}
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

      {/* Add Task Button */}
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

      {/* Add/Edit Task Modal */}
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
              onChangeText={(text) => setCurrentTask({...currentTask, title: text})}
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
  container: {
    flex: 1,
    backgroundColor: '#6B4EFF',
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  list: {
    paddingHorizontal: 20,
  },
  taskCard: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  completedTaskCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  taskLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  taskRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#F0EEFF',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A1A',
  },
    taskTitle: {
      fontSize: 16,
      fontWeight: '500',
      color: '#1A1A1A',
    },
    emptyText: {
      textAlign: 'center',
      color: '#FFF',
      fontSize: 18,
      marginTop: 20,
    },
    addButton: {
      backgroundColor: '#FFF',
      borderRadius: 30,
      paddingVertical: 15,
      marginVertical: 20,
      marginHorizontal: 20,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
    },
    addButtonText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#6B4EFF',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      backgroundColor: '#FFF',
      padding: 20,
      borderRadius: 10,
      width: '80%',
      alignItems: 'center',
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#6B4EFF',
      marginBottom: 15,
    },
    input: {
      width: '100%',
      borderWidth: 1,
      borderColor: '#DDD',
      borderRadius: 5,
      padding: 10,
      marginBottom: 15,
      fontSize: 16,
      color: '#333',
    },
    modalButtons: {
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-between',
    },
    modalButton: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 5,
      marginHorizontal: 5,
      alignItems: 'center',
    },
    cancelButton: {
      backgroundColor: '#FF4444',
    },
    saveButton: {
      backgroundColor: '#6B4EFF',
    },
    cancelButtonText: {
      color: '#FFF',
      fontWeight: 'bold',
    },
    saveButtonText: {
      color: '#FFF',
      fontWeight: 'bold',
    },
    editButton: {
      padding: 10,
    },
    deleteButton: {
      padding: 10,
    },
    checkbox: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: '#6B4EFF',
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 10,
    },
    checkedBox: {
      backgroundColor: '#6B4EFF',
      borderColor: '#6B4EFF',
    },
  });

  export default TodoApp;
