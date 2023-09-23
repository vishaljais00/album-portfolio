import { setDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
// import styles from './imagesScreen.module.css'


export default function ImagesScreen({db, collection, onSnapshot, doc, addDoc, showComponent, fileId, deleteDoc, folderId}) {
    
   const [images , setImages] = useState({
    url: "",
    title: "",
    id: ""
   })

   const [formStatus, setFormStatus] = useState({
    show: false,
    type: 'upload'
   })
   
   const [imageArr , setImageArr] = useState([])
   const [searchQuery, setSearchQuery] = useState(''); // State to store the search query
   const [filteredFileArr, setFilteredFileArr] = useState([]);
   const [invalidUrl, setInvalidUrl] = useState(null);

   const handleImageError = () => {
    setInvalidUrl("https://www.freeiconspng.com/thumbs/no-image-icon/no-image-icon-6.png"); // Set the invalid URL state to true
  };

   // add new images or update images
    const createAlbum = async(e)=> {
        e.preventDefault()

        try {
            if(images.id !== ""){
                const filesRef = doc(db, "album", folderId , "files", fileId);
                // Create a reference to the subcollection within the album document
                const imagesCollectionRef = collection(filesRef, "images");
                  await setDoc(doc(imagesCollectionRef, images.id), {
                      title: images.title,
                      url: images.url,
                  });
                  toast.success("image updated successfully")
              }else{
                  const filesRef = doc(db, "album", folderId , "files", fileId);
                  // Create a reference to the subcollection within the album document
                  const imagesCollectionRef = collection(filesRef, "images");
                  // Add a new document to the subcollection
                  await addDoc(imagesCollectionRef, {
                  title: images.title,
                  url: images.url,
                  });
                  toast.success("image added successfully")
              }
              resetForm() 
            
        } catch (error) {
            toast.success("File added successfully")
        }
        if(images.title === '' || images.url === ''){
            toast.warning("Image Form is empty")
            return
        }

      
    }

    // Function to handle search input changes
  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Filter the imageArr based on the search query
    const filteredFiles = imageArr.filter((item) =>
      item.title.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredFileArr(filteredFiles);
  };

    // resetForm 

    const resetForm = () =>{
        setImages({url: "",
        title: "",
        id: ""})
        setFormStatus({show: false,type: 'upload'})
        setInvalidUrl()
    
    }
    // delete images

    async function removeBlog(id){
      await deleteDoc(doc(db, "album", folderId, "files", fileId, "images", id));
   }
    

    // check if file and folde id is present or not
    useEffect(() => {
        if(folderId ==  null || fileId ==  null){
            showComponent("SHOW_FOLDER")
        }
    }, [folderId,fileId, showComponent])
    

        //load data on screen load and on create and update
    useEffect(() => {

        onSnapshot(collection(db, "album", folderId, "files", fileId, "images"), (snapshot)=>{
            const images = snapshot.docs.map((doc)=>{
                return{
                    id: doc.id,
                    ...doc.data()
                }
            })

            setImageArr(images)
            setFilteredFileArr(images)
        })
    }, [collection, db, onSnapshot, folderId, fileId]);
  return (
    <div className='container-fluid'>
        {formStatus.show ? 
        <div className='text-center folderForm'>
            {/* form div for folder cration */}
           
            <span>{formStatus.type} a image</span>
            <form className='p-2' onSubmit={createAlbum}>
            <div className='d-flex text-align-center justify-content-between row'>
                <div className='col-xl-5 col-lg-5 col-md-4 col-12'>
                    <img src={!invalidUrl ? images.url : invalidUrl} className='formImage'
                        alt="no cover" onError={handleImageError} 
                    />
                </div> 
                <div className='my-auto p-3  col-xl-7 col-lg-7 col-md-8 col-12'> 
                    <input placeholder='Image Name' className='mb-2' 
                        value={images.title} 
                        onChange={(e)=>setImages(prev=>({...prev, title: e.target.value}))} 
                        />
                    <input placeholder='Image URL' className='mb-2' value={images.url} 
                        onChange={(e)=>{setImages(prev=>({...prev, url: e.target.value})); setInvalidUrl(null)}} 
                    />
                </div>
                    
            </div>  
                <div className='text-center p-2'>
                    <button type='button' className='clear' onClick={resetForm} >Clear</button>
                    <button type='submit' className='create'>{formStatus.type}</button>
                </div>
            </form>
        </div>
        : <></> }

        
        <div className='container mt-4 border-2 border-secondary p-3 rounded shadow'>
          {/* for images shown  */}
            <div className='d-flex align-items-center justify-content-end p-2 row'>
                <div className='d-flex align-items-center col-xl-8 col-lg-8 col-md-6 col-12'>
                    <span className='backButtonContainer' onClick={()=>showComponent("SHOW_FILE")}>
                        <img src='/assets/back.png' alt='back'/>
                    </span>
                    
                    <p className='albumHead' >Your images</p>
                </div>
                <div className='searchContainer col-xl-4 col-lg-4 col-md-6 col-12 p-1'>
                        <input placeholder="Search..."
                         value={searchQuery}
                         onChange={handleSearchInputChange}
                         ></input>
                {formStatus.show ? 
                    <button className="btn btn-danger  ms-2" onClick={resetForm}>Clear</button> :
                    <button className="btn btn-success ms-2" onClick={()=>setFormStatus({show: true, type: 'upload'})}>{formStatus.type}</button>
                }
                </div>
               
            </div>
            
            {/* Map for Dynamic Folder */}
            <div className='albumCardBody'>
                {filteredFileArr?.map((item, i)=>
                    <div key={i} className='albumCard' >
                       
                        <div className='h-90 w-100 p-3 position-relative'>
                        <i className="fa fa-trash rounded-circle border bg-danger border-danger p-2 
                        text-light position-absolute top-0 end-0 "
                            onClick={()=>removeBlog(item.id)}
                            ></i> 
                           <img src={invalidUrl && images.id === item.id ? invalidUrl : item.url } 
                           alt="images" cursorshover="true" 
                          ></img>
                        </div> 
                        <div className='albumFooter'>
                            <span></span>
                            <span cursorshover="true">{item.title} 
                                
                            </span>
                            <i className="fa fa-pencil rounded-circle border bg-primary border-primary p-1 me-1 text-light"
                            onClick={()=>{
                                setFormStatus({show: true, type: 'update'})
                                setImages({...item})
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
