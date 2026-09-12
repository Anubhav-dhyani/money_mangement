import { Download, FileSpreadsheet, Pencil, Plus, Search, Trash2, Upload, UserPlus, Users as UsersIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api.js';
import Modal from '../components/Modal.jsx';
import EmptyState from '../components/EmptyState.jsx';

const blank = { name:'', uniqueId:'', mobile:'', email:'', accountNumber:'', ifscCode:'', bankName:'' };
const fields = [['name','Full name'],['uniqueId','Unique ID'],['mobile','Mobile number'],['email','Email address'],['accountNumber','Account number'],['ifscCode','IFSC code'],['bankName','Bank name']];
export default function Users() {
  const [users,setUsers]=useState([]), [search,setSearch]=useState(''), [form,setForm]=useState(blank), [editing,setEditing]=useState(null), [modal,setModal]=useState(false), [importModal,setImportModal]=useState(false), [loading,setLoading]=useState(true), [saving,setSaving]=useState(false), [file,setFile]=useState(null), [result,setResult]=useState(null);
  const fileRef=useRef();
  const load=async()=>{setLoading(true);try{const {data}=await api.get('/users',{params:{search,limit:100}});setUsers(data.users);}finally{setLoading(false)}};
  useEffect(()=>{const t=setTimeout(load,250);return()=>clearTimeout(t)},[search]);
  const openAdd=()=>{setEditing(null);setForm(blank);setModal(true)};
  const openEdit=(u)=>{setEditing(u);setForm(fields.reduce((a,[k])=>({...a,[k]:u[k]}),{}));setModal(true)};
  const save=async(e)=>{e.preventDefault();setSaving(true);try{if(editing)await api.put(`/users/${editing._id}`,form);else await api.post('/users',form);toast.success(editing?'User updated':'User added');setModal(false);load();}catch(e){toast.error(e.response?.data?.message||'Could not save user.')}finally{setSaving(false)}};
  const remove=async(u)=>{if(!window.confirm(`Delete ${u.name}? They will also be removed from any events.`))return;try{await api.delete(`/users/${u._id}`);toast.success('User deleted');load();}catch(e){toast.error(e.response?.data?.message||'Could not delete user.')}};
  const importCsv=async()=>{if(!file)return toast.error('Choose a CSV file first.');setSaving(true);const fd=new FormData();fd.append('file',file);try{const {data}=await api.post('/users/import',fd);setResult(data);toast.success(data.message);load();}catch(e){const data=e.response?.data;setResult(data);toast.error(data?.message||'Import failed.')}finally{setSaving(false)}};
  const template=()=>{const csv='Name,Unique ID,Mobile,Email,Account Number,IFSC Code,Bank Name\nAarav Sharma,USR-001,9876543210,aarav@example.com,123456789012,SBIN0001234,State Bank of India\n';const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.download='eventflow-user-template.csv';a.click();URL.revokeObjectURL(a.href)};
  return <div className="page-content">
    <div className="action-bar"><div className="table-search"><Search size={18}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name, ID, email or mobile…"/></div><div><button className="secondary-btn" onClick={()=>{setFile(null);setResult(null);setImportModal(true)}}><Upload size={17}/> Bulk upload</button><button className="primary-btn" onClick={openAdd}><Plus size={17}/> Add user</button></div></div>
    <section className="panel table-panel"><div className="panel-head"><div><h2>User directory</h2><p>{users.length} record{users.length!==1?'s':''} shown</p></div></div>
      <div className="table-scroll"><table><thead><tr><th>User</th><th>Unique ID</th><th>Contact</th><th>Bank</th><th>Account details</th><th></th></tr></thead><tbody>
        {users.map(u=><tr key={u._id}><td><div className="user-cell"><div className="mini-avatar">{u.name[0]}</div><strong>{u.name}</strong></div></td><td><span className="id-chip">{u.uniqueId}</span></td><td><strong className="table-primary">{u.mobile}</strong><small>{u.email}</small></td><td><strong className="table-primary">{u.bankName}</strong></td><td><strong className="table-primary">•••• {u.accountNumber.slice(-4)}</strong><small>{u.ifscCode}</small></td><td><div className="row-actions"><button className="icon-btn" onClick={()=>openEdit(u)}><Pencil size={16}/></button><button className="icon-btn danger" onClick={()=>remove(u)}><Trash2 size={16}/></button></div></td></tr>)}
      </tbody></table></div>{!loading&&!users.length&&<EmptyState icon={UsersIcon} title="No users found" text={search?'Try a different search term.':'Add someone manually or import a CSV to get started.'} action={!search&&<button className="primary-btn" onClick={openAdd}><UserPlus size={17}/> Add first user</button>}/>} {loading&&<div className="loading-state">Loading users…</div>}
    </section>
    <Modal open={modal} onClose={()=>setModal(false)} title={editing?'Edit user':'Add a new user'} subtitle="Enter identity, contact and bank information."><form className="form-grid" onSubmit={save}>{fields.map(([key,label])=><label key={key} className={key==='name'||key==='email'||key==='bankName'?'span-2':''}>{label}<input value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})} required placeholder={label}/></label>)}<div className="modal-actions span-2"><button type="button" className="secondary-btn" onClick={()=>setModal(false)}>Cancel</button><button className="primary-btn" disabled={saving}>{saving?'Saving…':editing?'Save changes':'Add user'}</button></div></form></Modal>
    <Modal open={importModal} onClose={()=>setImportModal(false)} title="Bulk upload users" subtitle="Import up to 5,000 people from a CSV file.">
      <div className="template-row"><div><FileSpreadsheet size={22}/><span><strong>Need the right format?</strong><small>Use our pre-formatted CSV template.</small></span></div><button className="text-btn" onClick={template}><Download size={16}/> Download</button></div>
      <button className={`dropzone ${file?'has-file':''}`} onClick={()=>fileRef.current.click()}><Upload size={26}/><strong>{file?file.name:'Choose a CSV file'}</strong><span>{file?`${(file.size/1024).toFixed(1)} KB`:'Click to browse · Maximum 5 MB'}</span></button><input hidden ref={fileRef} type="file" accept=".csv,text/csv" onChange={e=>{setFile(e.target.files[0]);setResult(null)}}/>
      {result&&<div className={`import-result ${result.failed?'warning':'success'}`}><strong>{result.message}</strong>{result.errors?.slice(0,5).map((x,i)=><span key={i}>Row {x.row}: {x.error}</span>)}</div>}
      <div className="modal-actions"><button className="secondary-btn" onClick={()=>setImportModal(false)}>Cancel</button><button className="primary-btn" disabled={!file||saving} onClick={importCsv}>{saving?'Importing…':'Import users'}</button></div>
    </Modal>
  </div>;
}
