
import { useReducer } from 'react';
import './App.css';
import Gallery from './containers/gallary/Gallery';
import Navbar from './containers/navbar/TopNav';
import { db } from './firebase-init';
import { collection, doc, addDoc, onSnapshot, deleteDoc  } from "firebase/firestore"; 
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FileScreen from './containers/files/fileScreen';
import useLocalStorage from './customHooks/useLocalStorage';
import ImagesScreen from './containers/images/ImagesScreen';


const reducer = (state, action) => {
  switch (action.type) {
    case "SHOW_FOLDER": {
      return {
        type: "FOLDER",
      };
    }

    case "SHOW_FILE": {
      return {
        type: "FILE"
        
      };
    }
    case "SHOW_IMAGES": {
      return {
        type: "IMAGES"
      };
    }
    
    default:
      return {
        type: "FOLDER"
      };;
  }
};


function App() {

  const [folderId, setFoldeId] = useLocalStorage('folderId', "");
  const [fileId, setFileId] = useLocalStorage('fileId', "");
  const [state, dispatch] = useReducer(reducer, { type: "FOLDER" });

  const showType = async(type) =>{
    dispatch({
      type: type,
      payload: { expense: type },
    });
  }

  return (
    <div className="App">
      <Navbar/>
      {state.type === 'FOLDER'?
        <Gallery db={db} doc={doc}
          collection={collection} addDoc={addDoc} 
          onSnapshot={onSnapshot} showComponent={showType}
          setFoldeId={setFoldeId}
        />
      : state.type === 'FILE' ?

        <FileScreen db={db} doc={doc} 
        collection={collection} addDoc={addDoc} 
        onSnapshot={onSnapshot} showComponent={showType} folderId={folderId} setFileId={setFileId} />
      : 
      
        <ImagesScreen db={db} doc={doc} 
        collection={collection} addDoc={addDoc}  deleteDoc={deleteDoc}
        onSnapshot={onSnapshot} showComponent={showType} folderId={folderId} fileId={fileId} 
      />
      }

      
      <ToastContainer />
    </div>
  );
}

export default App;
