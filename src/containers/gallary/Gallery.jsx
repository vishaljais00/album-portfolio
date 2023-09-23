import React, { useEffect, useState } from 'react'
import styles from './gallery.module.css'
import { toast } from 'react-toastify';
import { setDoc } from 'firebase/firestore';
export default function Gallery({db , updateDoc, collection, onSnapshot, doc, addDoc, showComponent, setFoldeId}) {


   const [album , setAlbum] = useState({
    url: "",
    title: "",
    id: ""
   })

   const [formStatus, setFormStatus] = useState({
    show: false,
    type: 'create'
   })
   
   const [albumArr , setAlbumArr] = useState([])
   const [searchQuery, setSearchQuery] = useState(''); // State to store the search query
   const [filteredFileArr, setFilteredFileArr] = useState([]);
   const [invalidUrl, setInvalidUrl] = useState(null);

   const handleImageError = () => {
    setInvalidUrl("https://www.freeiconspng.com/thumbs/no-image-icon/no-image-icon-6.png"); // Set the invalid URL state to true
  };

   // add new album or update album
    const createAlbum = async(e)=> {
        e.preventDefault()
        if(album.title === '' || album.url === ''){
            toast.warning("album is empty")
            return
        }

        if(album.id !== ""){
            console.log("album.id ", album.id )
            await setDoc(doc(db, "album", album.id), {
                title: album.title,
                url: album.url,
            });
        }else{
            await addDoc(collection(db, "album"), {
                title: album.title,
                url: album.url,
            });
        }
        resetForm() 
    }


    // Function to handle search input changes
  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Filter the fileArr based on the search query
    const filteredFiles = albumArr.filter((item) =>
      item.title.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredFileArr(filteredFiles);
  };



    // resetForm 

    const resetForm = () =>{
        setAlbum({url: "",
        title: "",
        id: ""})
        setFormStatus({show: false,type: 'create'})
        setInvalidUrl(null)
    
    }
    

    useEffect(() => {

        onSnapshot(collection(db, "album"), (snapshot)=>{
            const albums = snapshot.docs.map((doc)=>{
                return{
                    id: doc.id,
                    ...doc.data()
                }
            })

            setAlbumArr(albums)
            setFilteredFileArr(albums)
        })
    }, [collection, db, onSnapshot]);
  return (
    <div className='container-fluid'>
        {formStatus.show ? 
        <div className={styles.folderForm}>
            {/* form div for folder cration */}
            <span>{formStatus.type} an Album</span>
            <form className='p-2' onSubmit={createAlbum}> 
                <div className='d-flex text-align-center justify-content-center'>
                    <div >
                        <img src={!invalidUrl ? album.url : invalidUrl} height='150px'
                         alt="no cover" onError={handleImageError} 
                        />
                    </div>
                    <div className='my-auto p-2 ms-2 inputBorder'>
                        <input placeholder='Album Name' className='mb-2' 
                            value={album.title} 
                            onChange={(e)=>setAlbum(prev=>({...prev, title: e.target.value}))} 
                        />
                        <input placeholder='Album Cover' className='mb-2' 
                            value={album.url} onChange={(e)=>{setAlbum(prev=>({...prev, url: e.target.value})); setInvalidUrl(null)}} 
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
        <div className='container border border-primary mt-4'>
            {/* for folder shown  */}
            <div className='d-flex align-items-center justify-content-between p-2'>
                <div className='d-flex align-items-center'>
                    <p className={styles.albumHead} >Your albums</p>
                </div>
                <div className='searchContainer'>
                        <input placeholder="Search..."
                         value={searchQuery}
                         onChange={handleSearchInputChange}
                         ></input>
                {formStatus.show ? 
                    <button className="btn btn-danger ms-2" onClick={resetForm}>Clear</button> :
                    <button className="btn btn-success ms-2" onClick={()=>setFormStatus({show: true, type: 'create'})}>{formStatus.type}</button>
                }
                </div>
               
            </div>
            
            {/* Map for Dynamic Folder */}
            <div className={styles.albumCardBody}>
                {filteredFileArr?.map((item, i)=>
                    <div key={i} className={styles.albumCard} >
                        <div className='h-90 w-100 p-3'>
                           <img src={invalidUrl && album.id === item.id ? invalidUrl : item.url } alt="images" cursorshover="true" 
                           onClick={()=>{
                            showComponent("SHOW_FILE");
                            setFoldeId(item.id)
                            }}></img>
                        </div> 
                        <div className={styles.albumFooter}>
                            <span></span>
                            <span cursorshover="true">{item.title} 
                                
                            </span>
                            <i className="fa fa-pencil rounded-circle border bg-danger border-danger p-1 me-1 text-light"
                            onClick={()=>{
                                setFormStatus({show: true, type: 'update'})
                                setAlbum({...item})
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