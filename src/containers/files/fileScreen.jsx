import { setDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import styles from './fileScreen.module.css'


export default function FileScreen({db , updateDoc, collection, onSnapshot, doc, addDoc, showComponent, folderId, setFileId}) {
    
   const [files , setFiles] = useState({
    url: "",
    title: "",
    id: ""
   })

   const [formStatus, setFormStatus] = useState({
    show: false,
    type: 'create'
   })
   
   const [fileArr , setFileArr] = useState([])
   const [searchQuery, setSearchQuery] = useState(''); // State to store the search query
   const [filteredFileArr, setFilteredFileArr] = useState([]);
   const [invalidUrl, setInvalidUrl] = useState(null);

   const handleImageError = () => {
    setInvalidUrl("https://www.freeiconspng.com/thumbs/no-image-icon/no-image-icon-6.png"); // Set the invalid URL state to true
  };

   // add new files or update files
    const createAlbum = async(e)=> {
        e.preventDefault()
        if(files.title === '' || files.url === ''){
            toast.warning("file is empty")
            return
        }

        if(files.id !== ""){
            console.log("folderId",folderId, "files", files.id)
            const albumDocRef = doc(db, "album", folderId);
            // Create a reference to the subcollection within the album document
            const filesCollectionRef = collection(albumDocRef, "files");
            await setDoc(doc(filesCollectionRef, files.id), {
                title: files.title,
                url: files.url,
            });
        }else{
            const albumDocRef = doc(db, "album", folderId);
            // Create a reference to the subcollection within the album document
            const filesCollectionRef = collection(albumDocRef, "files");
            // Add a new document to the subcollection
            await addDoc(filesCollectionRef, {
            title: files.title,
            url: files.url,
            });
        }
        resetForm() 
    }

    // Function to handle search input changes
  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Filter the fileArr based on the search query
    const filteredFiles = fileArr.filter((item) =>
      item.title.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredFileArr(filteredFiles);
  };

    // resetForm 

    const resetForm = () =>{
        setFiles({url: "",
        title: "",
        id: ""})
        setFormStatus({show: false,type: 'create'})
        setInvalidUrl()
    
    }
    
    useEffect(() => {
        if(folderId ==  null){
            showComponent("SHOW_FOLDER")
        }
    }, [folderId, showComponent])
    

    useEffect(() => {

        onSnapshot(collection(db, "album", folderId, "files"), (snapshot)=>{
            const files = snapshot.docs.map((doc)=>{
                return{
                    id: doc.id,
                    ...doc.data()
                }
            })

            setFileArr(files)
            setFilteredFileArr(files)
        })
    }, [collection, db, onSnapshot, folderId]);
  return (
    <div className='container-fluid'>
        {formStatus.show ? 
        <div className={styles.folderForm}>
            {/* form div for folder cration */}
           
            <span>{formStatus.type} a file</span>
            <form className='p-2' onSubmit={createAlbum}>
            <div className='d-flex text-align-center justify-content-center'>
                <div >
                    <img src={!invalidUrl ? files.url : invalidUrl} height='150px'
                        alt="no cover" onError={handleImageError} 
                    />
                </div> 
                <div className='my-auto p-2 ms-2 inputBorder'> 
                    <input placeholder='File Name' className='mb-2' 
                        value={files.title} 
                        onChange={(e)=>setFiles(prev=>({...prev, title: e.target.value}))} 
                        />
                    <input placeholder='File Cover' className='mb-2' value={files.url} 
                        onChange={(e)=>{setFiles(prev=>({...prev, url: e.target.value})); setInvalidUrl(null)}} 
                    />
                </div>
                    
                    </div>  
                <div className='text-center p-2'>

                    <button type='button' className={styles.clear} onClick={resetForm} >Clear</button>
                    <button type='submit' className={styles.create}>{formStatus.type}</button>
                </div>
            </form>
        </div>
        : <></> }

        {/* for files shown  */}
        <div className='container border border-primary mt-4'>
          
            <div className='d-flex align-items-center justify-content-between p-2'>
                <div className='d-flex align-items-center'>
                    <span className='backButtonContainer' onClick={()=>showComponent("SHOW_FOLDER")}>
                        <img src='/assets/back.png' alt='back'/>
                    </span>
                    
                    <p className={styles.albumHead} >Your Files</p>
                </div>
                <div className='searchContainer'>
                        <input placeholder="Search..."
                         value={searchQuery}
                         onChange={handleSearchInputChange}
                         ></input>
                {formStatus.show ? 
                    <button className="btn btn-danger  ms-2" onClick={resetForm}>Clear</button> :
                    <button className="btn btn-success ms-2" onClick={()=>setFormStatus({show: true, type: 'create'})}>{formStatus.type}</button>
                }
                </div>
               
            </div>
            
            {/* Map for Dynamic Folder */}
            <div className={styles.albumCardBody}>
                {filteredFileArr?.map((item, i)=>
                    <div key={i} className={styles.albumCard} >
                        <div className='h-90 w-100 p-3'>
                           <img src={invalidUrl && files.id === item.id ? invalidUrl : item.url } alt="images" cursorshover="true" 
                           onClick={()=>{
                            showComponent("SHOW_IMAGES")
                            setFileId(item.id);
                            }}></img>
                        </div> 
                        <div className={styles.albumFooter}>
                            <span></span>
                            <span cursorshover="true">{item.title} 
                                
                            </span>
                            <i className="fa fa-pencil rounded-circle border bg-danger border-danger p-1 me-1 text-light"
                            onClick={()=>{
                                setFormStatus({show: true, type: 'update'})
                                setFiles({...item})
                                }}
                            ></i> 
                        </div>
                            
                    </div>
                )}   
            </div>
        </div>
    </div>
  )
}
