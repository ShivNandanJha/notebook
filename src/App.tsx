import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { Container, Stack } from "react-bootstrap";
import NewNote from "./NewNote";
import useLocalStorage from "./UseLocalStorage";
import { useMemo } from "react";
import { v4 as uuidV4 } from "uuid";
import NoteList from "./NoteList";
import NoteLayout from "./NoteLayout";
import Note from "./Note";
import EditNote from "./EditNote";

export type Note = {
  id: string;
} & NoteData;

export type RawNote = {
  id: string;
} & RawNoteData;

export type RawNoteData = {
  title: string;
  markdown: string;
  tagIds: string[];
};

export type NoteData = {
  title: string;
  markdown: string;
  tags: Tag[];
};

export type Tag = {
  id: string;
  label: string;
};
function App() {
  const [notes, setNotes] = useLocalStorage<RawNote[]>("NOTES", []);
  const [tags, setTags] = useLocalStorage<Tag[]>("TAGS", []);

  const noteWithTags = useMemo(() => {
    return notes.map((note) => {
      return {
        ...note,
        tags: tags.filter((tag) => note.tagIds.includes(tag.id)),
      };
    });
  }, [notes, tags]);

  function onCreateNote({ tags, ...data }: NoteData) {
    setNotes((prevNotes) => {
      return [
        ...prevNotes,
        { ...data, id: uuidV4(), tagIds: tags.map((tag) => tag.id) },
      ];
    });
  }

  function addTag(tag: Tag) {
    setTags((prev) => [...prev, tag]);
  }

  function onUpdateNote(id: string, { tags, ...data }: NoteData) {
    setNotes((prevNotes) => {
      return prevNotes.map((note) => {
        if (note.id === id) {
          return { ...note, ...data, tagIds: tags.map((tag) => tag.id) };
        } else {
          return note;
        }
      });
    });
  }

  function OnDeleteNote(id: string) {
    setNotes((prevNotes) => {
      return prevNotes.filter((note) => note.id !== id);
    });
  }

  function updateTags(id: string, label: string) {
    setTags((prevTags) => {
      return prevTags.map((tag) => {
        if (tag.id === id) {
          return { ...tag, label };
        } else {
          return tag;
        }
      });
    });
  }
  function deleteTags(id: string) {
    setTags((prevTags) => {
      return prevTags.filter((tag) => tag.id !== id);
    });
  }
  return (
    <> <div className="container">
      <Container className="my-4  card">
        <Routes>
          <Route
            path="/"
            element={
              <NoteList
                notes={noteWithTags}
                availableTags={tags}
                onUpdateTags={updateTags}
                onDeleteTags={deleteTags}
              />
            }
          ></Route>
          <Route
            path="new"
            element={
              <NewNote
                onSubmit={onCreateNote}
                onAddTag={addTag}
                availableTags={tags}
              />
            }
          ></Route>
          <Route path="/:id" element={<NoteLayout notes={noteWithTags} />}>
            <Route index element={<Note onDelete={OnDeleteNote} />}></Route>
            <Route
              path="edit"
              element={
                <EditNote
                  onSubmit={onUpdateNote}
                  onAddTag={addTag}
                  availableTags={tags}
                />
              }
            ></Route>
          </Route>
          <Route path="*" element={<Navigate to="/" />}></Route>
        </Routes>
      </Container>

      <Container className="card">
        {" "}  <h6>App developed by</h6>
        <Stack className="justify-content-start ">
          <h5>Shiv Nandan Jha</h5>
          <Stack className="ml-5" direction="horizontal"  > <a target={"_blank"} rel="noreferrer" href="https://www.linkedin.com/in/shiv-nandan-jha-4179a4251">
            <img className="Link" src="../linkedin.png" alt="Linkedin" />
          </a>
          <a target={"_blank"} rel="noreferrer"  href="https://github.com/ShivNandanJha">
            <img className="link2" src="../github.png" alt="github" />
          </a>
          <a target={"_blank"} rel="noreferrer" href="https://codepen.io/Shivi-Code">
            <img className="link3" src="../codepen.png" alt="codepan" />
          </a>
          <a target={"_blank"} rel="noreferrer" href="https://www.instagram.com/probably_shiv/">
            <img className="link3" src="../instagram.png" alt="instagram" />
          </a></Stack>
         
        </Stack>
        
      </Container>
      </div>
    </>
  );
}

export default App;
