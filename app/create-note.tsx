import CustomRichEditor from '@/components/CustomRichEditor';
import useNotes from '@/hooks/useNotes';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';

export default function CreateNoteScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { id } = params;
  
  const richText = useRef<CustomRichEditor>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [completed, setCompleted] = useState(false);
  
  const { notes, saveNote, updateNote } = useNotes();

  useEffect(() => {
    if (id) {
      // Modo edición: cargar la nota existente
      const noteId = Number(id);
      const noteToEdit = notes.find(note => note.id === noteId);
      if (noteToEdit) {
        console.log('Nota a editar:', noteToEdit.descripcion);
        setTitle(noteToEdit.titulo);
        setContent(noteToEdit.descripcion);
        setCompleted(noteToEdit.completada);
        richText.current?.setContentHTML(noteToEdit.descripcion);
      }
    }
  }, [id, notes]);

  const handleSave = async () => {
    if (!title.trim()) {
      alert('Por favor ingresa un título para la nota');
      return;
    }

    try {
      if (id) {
        // Modo edición
        await updateNote(Number(id), { 
          titulo: title, 
          descripcion: content,
          completada: completed
        });
      } else {
        // Modo creación
        await saveNote({
          titulo: title.trim(),
          descripcion: content,
          completada: completed
        });
      }
      router.back();
    } catch (error) {
      alert('Error al guardar la nota');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        nestedScrollEnabled={false}
      >
        <TextInput
          style={styles.titleInput}
          placeholder="Título de la nota"
          placeholderTextColor="#999"
          value={title}
          onChangeText={setTitle}
        />

        <CustomRichEditor
          ref={richText}
          style={styles.editor}
          initialContentHTML={content}
          onChange={setContent}
          placeholder="Escribe el contenido de tu nota aquí..."
          useContainer={true}
        />

        <RichToolbar
          editor={richText}
          selectedIconTint="#873c1e"
          iconTint="#312921"
          scalesPageToFit={Platform.OS === 'android'}
          actions={[
            actions.setBold,
            actions.setItalic,
            actions.setUnderline,
            actions.insertBulletsList,
            actions.insertOrderedList,
            actions.insertLink,
            actions.setStrikethrough,
            actions.blockquote,
            actions.alignLeft,
            actions.alignCenter,
            actions.alignRight,
            actions.undo,
            actions.redo,
          ]}
          style={styles.toolbar}
        />
      </ScrollView>
      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => handleSave()}
      >
        <MaterialIcons name="save" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
    paddingHorizontal: 4
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  titleInput: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 15,
    color: '#000',
  },
  editor: {
    flex: 1,
    minHeight: 300,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  toolbar: {
    backgroundColor: '#f5f5f5',
    borderColor: '#eee',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#6200ee',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
});