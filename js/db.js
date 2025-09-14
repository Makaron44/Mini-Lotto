
(function(){
  const DB_NAME='mini-lotto-db', DB_VERSION=1;
  function openDB(){return new Promise((res,rej)=>{const r=indexedDB.open(DB_NAME,DB_VERSION);r.onupgradeneeded=e=>{const db=e.target.result;
    if(!db.objectStoreNames.contains('tickets')){const s=db.createObjectStore('tickets',{keyPath:'id',autoIncrement:true});s.createIndex('by_game','gameKey');s.createIndex('by_ts','ts');}
    if(!db.objectStoreNames.contains('meta')){db.createObjectStore('meta',{keyPath:'key'});}
  };r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error);});}
  function tx(db,store,mode='readonly'){return db.transaction(store,mode).objectStore(store);}
  async function addTicket(ticket){const db=await openDB();return new Promise((res,rej)=>{const s=tx(db,'tickets','readwrite');const q=s.add(ticket);q.onsuccess=()=>res(q.result);q.onerror=()=>rej(q.error);});}
  async function listTickets(gameKey){const db=await openDB();return new Promise((res,rej)=>{const s=tx(db,'tickets');const q=s.index('by_game').getAll(gameKey);q.onsuccess=()=>{const a=q.result||[];a.sort((a,b)=>(b.ts||'').localeCompare(a.ts||''));res(a)};q.onerror=()=>rej(q.error);});}
  async function removeTicket(id){const db=await openDB();return new Promise((res,rej)=>{const s=tx(db,'tickets','readwrite');const q=s.delete(id);q.onsuccess=()=>res();q.onerror=()=>rej(q.error);});}
  async function clearTickets(){const db=await openDB();return new Promise((res,rej)=>{const s=tx(db,'tickets','readwrite');const q=s.clear();q.onsuccess=()=>res();q.onerror=()=>rej(q.error);});}
  async function getMeta(key){const db=await openDB();return new Promise((res,rej)=>{const s=tx(db,'meta');const q=s.get(key);q.onsuccess=()=>res(q.result?q.result.value:null);q.onerror=()=>rej(q.error);});}
  async function setMeta(key,value){const db=await openDB();return new Promise((res,rej)=>{const s=tx(db,'meta','readwrite');const q=s.put({key,value});q.onsuccess=()=>res();q.onerror=()=>rej(q.error);});}
  async function migrateLocalStorageTickets(){try{const done=await getMeta('migratedLS');if(done)return;const raw=localStorage.getItem('mini-lotto-saved');if(!raw){await setMeta('migratedLS',1);return;}const arr=JSON.parse(raw||'[]');for(const it of arr){try{await addTicket(it)}catch(e){}}await setMeta('migratedLS',1);}catch(e){}}
  window.DB={addTicket,listTickets,removeTicket,clearTickets,migrateLocalStorageTickets};
})();
