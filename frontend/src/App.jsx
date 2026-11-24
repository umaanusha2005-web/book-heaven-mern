import { useEffect, useState } from "react";
import { Link, NavLink, Route, Routes, useNavigate } from "react-router-dom";
import api from "./api";

// 🌟 8 completely different book covers
const BOOK_COVERS = [
  "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop", // Dark poetry
  "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop", // Vintage library
  "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&auto=format&fit=crop", // Open brown novel
  "https://images.unsplash.com/photo-1532012164546-f432f2e3777f?w=600&auto=format&fit=crop", // Science & Arts
  "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600&auto=format&fit=crop", // History / Law
  "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=600&auto=format&fit=crop", // Poetry & Quotes
  "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop", // Stories & Notes
  "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600&auto=format&fit=crop"  // Colorful Spines
];

// 🔒 GUARANTEES the EXACT SAME image for a book across All Books, Cart & Favorites
function getBookCover(book) {
  if (book?.url && book.url.trim().length > 5) {
    return book.url;
  }
  const key = book?.title || book?._id || "default";
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = key.charCodeAt(i) + ((hash << 5) - hash);
  }
  return BOOK_COVERS[Math.abs(hash) % BOOK_COVERS.length];
}

function App() {
  const [user, setUser] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) return;
    api.get("/auth/me").then(r => setUser(r.data.user)).catch(() => {
      localStorage.removeItem("token"); setUser(null);
    });
  }, [refresh]);

  function logout() {
    localStorage.removeItem("token"); setUser(null); navigate("/");
  }

  return <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
    <header className="navbar">
      <Link className="brand" to="/">📚 Book Heaven</Link>
      <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/books">All Books</NavLink>
        {user && <><NavLink to="/favorites">Favorites</NavLink><NavLink to="/cart">Cart</NavLink><NavLink to="/profile">Profile</NavLink></>}
        {user?.role === "admin" && <NavLink to="/admin">Admin</NavLink>}
      </nav>
      <div className="nav-actions">
        {user ? <button className="small-btn" onClick={logout}>Logout</button> :
          <><Link className="small-btn" to="/login">Login</Link><Link className="small-btn accent" to="/register">Register</Link></>}
      </div>
    </header>

    <main style={{ flex: 1 }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/books" element={<Books user={user} />} />
        <Route path="/login" element={<Auth mode="login" onLogin={() => setRefresh(x => x + 1)} />} />
        <Route path="/register" element={<Auth mode="register" />} />
        <Route path="/favorites" element={<Collection type="favorites" />} />
        <Route path="/cart" element={<Collection type="cart" />} />
        <Route path="/profile" element={<Profile user={user} />} />
        <Route path="/admin" element={<Admin user={user} />} />
        <Route path="*" element={<h2 style={{ padding: "40px", textAlign: "center" }}>Page not found</h2>} />
      </Routes>
    </main>

    <footer>© {new Date().getFullYear()} Book Heaven · Discover your next favourite book</footer>
  </div>;
}

/* ========================================================
   HOME PAGE
   ======================================================== */
function Home() {
  return (
    <div>
      <section style={{
        position: "relative",
        backgroundImage: "linear-gradient(135deg, rgba(15, 23, 42, 0.88) 0%, rgba(30, 41, 59, 0.78) 50%, rgba(15, 23, 42, 0.92) 100%), url('https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1600&auto=format&fit=crop')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        color: "#ffffff",
        padding: "70px 30px",
        borderRadius: "20px",
        margin: "16px auto",
        maxWidth: "1200px",
        boxShadow: "0 20px 45px rgba(0, 0, 0, 0.25)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "40px"
      }}>
        <div style={{ flex: "1 1 500px", maxWidth: "600px" }}>
          <div style={{
            display: "inline-block",
            padding: "6px 14px",
            background: "rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(8px)",
            borderRadius: "20px",
            fontSize: "0.85rem",
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            marginBottom: "16px",
            border: "1px solid rgba(255, 255, 255, 0.2)"
          }}>
            ✨ A World Of Inspiring Stories
          </div>

          <h1 style={{ fontSize: "3rem", lineHeight: "1.15", margin: "0 0 16px 0", fontWeight: "800" }}>
            Find your next <br />
            <span style={{ color: "#f59e0b" }}>great read.</span>
          </h1>

          <p style={{ fontSize: "1.15rem", lineHeight: "1.6", opacity: 0.9, marginBottom: "26px" }}>
            Immerse yourself in handpicked literature, timeless classics, and captivating new releases. Build your dream personal bookshelf today.
          </p>

          <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
            <Link 
              className="primary-btn" 
              to="/books" 
              style={{
                padding: "14px 28px",
                fontSize: "1rem",
                borderRadius: "30px",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: "0 8px 20px rgba(245, 158, 11, 0.35)"
              }}
            >
              Explore Books →
            </Link>
            <Link 
              to="/register" 
              className="small-btn"
              style={{
                padding: "14px 24px",
                fontSize: "1rem",
                borderRadius: "30px",
                textDecoration: "none",
                background: "rgba(255, 255, 255, 0.15)",
                color: "#ffffff",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                backdropFilter: "blur(6px)"
              }}
            >
              Join Book Heaven
            </Link>
          </div>
        </div>

        <div style={{ flex: "1 1 360px", display: "flex", justifyContent: "center" }}>
          <div style={{
            position: "relative",
            background: "rgba(255, 255, 255, 0.1)",
            padding: "12px",
            borderRadius: "24px",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.25)",
            boxShadow: "0 15px 35px rgba(0, 0, 0, 0.35)"
          }}>
            <img 
              src="https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop" 
              alt="Book Heaven Aesthetic"
              style={{
                width: "100%",
                maxWidth: "380px",
                height: "300px",
                objectFit: "cover",
                borderRadius: "18px",
                display: "block"
              }}
            />
          </div>
        </div>
      </section>

      <section style={{
        maxWidth: "1200px",
        margin: "30px auto 40px auto",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: "20px",
        padding: "0 10px"
      }}>
        <div style={{ background: "#ffffff", padding: "24px", borderRadius: "16px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)", border: "1px solid #e2e8f0", textAlign: "center" }}>
          <div style={{ fontSize: "2.2rem", marginBottom: "8px" }}>📚</div>
          <h3 style={{ margin: "0 0 6px 0", fontSize: "1.15rem" }}>Curated Selection</h3>
          <p style={{ margin: 0, color: "#64748b", fontSize: "0.95rem" }}>Hand-picked titles across fiction, science, history, and arts.</p>
        </div>
        <div style={{ background: "#ffffff", padding: "24px", borderRadius: "16px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)", border: "1px solid #e2e8f0", textAlign: "center" }}>
          <div style={{ fontSize: "2.2rem", marginBottom: "8px" }}>❤️</div>
          <h3 style={{ margin: "0 0 6px 0", fontSize: "1.15rem" }}>Personal Favorites</h3>
          <p style={{ margin: 0, color: "#64748b", fontSize: "0.95rem" }}>Save the books you love and create custom wishlists anytime.</p>
        </div>
        <div style={{ background: "#ffffff", padding: "24px", borderRadius: "16px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)", border: "1px solid #e2e8f0", textAlign: "center" }}>
          <div style={{ fontSize: "2.2rem", marginBottom: "8px" }}>⚡</div>
          <h3 style={{ margin: "0 0 6px 0", fontSize: "1.15rem" }}>Simple & Seamless</h3>
          <p style={{ margin: 0, color: "#64748b", fontSize: "0.95rem" }}>Quick search, easy cart checkout, and instant book management.</p>
        </div>
      </section>
    </div>
  );
}

/* ========================================================
   ALL BOOKS (EXPLORE)
   ======================================================== */
function Books({ user }) {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => { 
    api.get("/books")
      .then(r => setBooks(r.data.data))
      .catch(() => setMessage("Could not load books. Check backend connection.")); 
  }, []);

  const visible = books.filter(b => `${b.title} ${b.author} ${b.category}`.toLowerCase().includes(search.toLowerCase()));

  async function add(path, id) {
    if (!user) return alert("Please log in first.");
    try { 
      const r = await api.post(`/${path}/${id}`); 
      setMessage(r.data.message); 
    } catch (e) { 
      setMessage(e.response?.data?.message || "Action failed"); 
    }
  }

  return <section className="page" style={{ paddingTop: "10px" }}>
    <div style={{
      width: "100%",
      minHeight: "220px",
      borderRadius: "16px",
      marginBottom: "28px",
      backgroundImage: "linear-gradient(rgba(15, 23, 42, 0.6), rgba(15, 23, 42, 0.75)), url('https://images.unsplash.com/photo-1507842229458-577749e472f3?w=1400&auto=format&fit=crop')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      padding: "36px 20px",
      color: "#ffffff",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)"
    }}>
      <p style={{ letterSpacing: "2px", fontSize: "0.85rem", textTransform: "uppercase", opacity: 0.9, margin: 0 }}>
        The Complete Collection
      </p>
      <h1 style={{ fontSize: "2.4rem", margin: "8px 0", fontWeight: "700" }}>
        Explore Our Books
      </h1>
      <p style={{ maxWidth: "550px", opacity: 0.95, margin: "0 0 18px 0", fontSize: "1rem" }}>
        Discover new arrivals, bestsellers, and timeless classics ready for your personal library.
      </p>

      <input 
        className="search" 
        placeholder="🔍 Search title, author or category..." 
        value={search} 
        onChange={e => setSearch(e.target.value)}
        style={{
          width: "100%",
          maxWidth: "460px",
          padding: "12px 20px",
          borderRadius: "30px",
          border: "none",
          fontSize: "1rem",
          boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
        }}
      />
    </div>

    {message && <p className="notice">{message}</p>}

    <div className="book-grid">
      {visible.map(book => {
        const coverImage = getBookCover(book);
        return (
          <article className="book-card" key={book._id}>
            <div className="cover" style={{ height: "240px", overflow: "hidden" }}>
              <img 
                src={coverImage} 
                alt={book.title} 
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={e => { e.currentTarget.src = BOOK_COVERS[0]; }} 
              />
            </div>
            <div className="book-info">
              <small>{book.category}</small>
              <h3>{book.title}</h3>
              <p>by {book.author}</p>
              <strong>₹{Number(book.price).toFixed(2)}</strong>
              <div className="card-actions">
                <button onClick={() => add("cart", book._id)}>Add to cart</button>
                <button className="outline" onClick={() => add("favorites", book._id)}>♡ Save</button>
              </div>
            </div>
          </article>
        );
      })}
    </div>

    {visible.length === 0 && (
      <div style={{ textAlign: "center", padding: "60px 20px" }}>
        <p style={{ fontSize: "1.1rem" }}>No books found. Add books using the admin account.</p>
      </div>
    )}
  </section>;
}

/* ========================================================
   AUTHENTICATION (LOGIN / REGISTER)
   ======================================================== */
function Auth({ mode, onLogin }) {
  const [form, setForm] = useState({ username: "", email: "", password: "", address: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const isLogin = mode === "login";

  function change(e) { setForm({ ...form, [e.target.name]: e.target.value }); }

  async function submit(e) {
    e.preventDefault(); setError("");
    try {
      const { data } = await api.post(`/auth/${isLogin ? "login" : "register"}`, form);
      if (isLogin) { localStorage.setItem("token", data.token); onLogin(); navigate("/"); }
      else navigate("/login");
    } catch (err) { setError(err.response?.data?.message || "Request failed"); }
  }

  return <section className="auth-wrap">
    <form className="auth-card" onSubmit={submit}>
      <p className="eyebrow">WELCOME TO BOOK HEAVEN</p>
      <h2>{isLogin ? "Login" : "Create account"}</h2>
      <label>Username<input name="username" value={form.username} onChange={change} required /></label>
      {!isLogin && <>
        <label>Email<input type="email" name="email" value={form.email} onChange={change} required /></label>
        <label>Address<input name="address" value={form.address} onChange={change} /></label>
      </>}
      <label>Password<input type="password" name="password" value={form.password} onChange={change} required minLength="6" /></label>
      {error && <p className="error">{error}</p>}
      <button className="primary-btn full">{isLogin ? "Login" : "Register"}</button>
      <p className="muted">
        {isLogin ? "New to Book Heaven?" : "Already have an account?"} <Link to={isLogin ? "/register" : "/login"}>{isLogin ? "Create account" : "Login"}</Link>
      </p>
    </form>
  </section>;
}

/* ========================================================
   🌟 FAVORITES & CART (NOW USES THE EXACT SAME COVERS)
   ======================================================== */
function Collection({ type }) {
  const [books, setBooks] = useState([]);
  const [message, setMessage] = useState("");

  async function load() {
    try { 
      const r = await api.get(`/${type}`); 
      setBooks(r.data.data); 
    } catch (e) { 
      setMessage(e.response?.data?.message || "Please log in to view this page."); 
    }
  }

  useEffect(() => { load(); }, [type]);

  async function remove(id) {
    await api.delete(`/${type}/${id}`); 
    load();
  }

  return <section className="page">
    <p className="eyebrow">YOUR LIBRARY</p>
    <h2>{type === "cart" ? "Your Cart" : "Your Favorites"}</h2>
    {message && <p className="notice">{message}</p>}
    <div className="book-grid">
      {books.map(b => {
        const coverImage = getBookCover(b);
        return (
          <article className="book-card compact" key={b._id}>
            <div className="cover" style={{ height: "180px", overflow: "hidden" }}>
              <img 
                src={coverImage} 
                alt={b.title} 
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={e => { e.currentTarget.src = BOOK_COVERS[0]; }} 
              />
            </div>
            <div className="book-info">
              <h3>{b.title}</h3>
              <p>by {b.author}</p>
              <strong>₹{Number(b.price).toFixed(2)}</strong>
              <button className="remove-btn" onClick={() => remove(b._id)}>Remove</button>
            </div>
          </article>
        );
      })}
    </div>
    {books.length === 0 && !message && <p>Your collection is empty.</p>}
  </section>;
}

/* ========================================================
   PROFILE
   ======================================================== */
function Profile({ user }) {
  if (!user) return <section className="page"><h2>Loading profile...</h2><p>Please log in to view your profile.</p></section>;
  return <section className="page">
    <p className="eyebrow">ACCOUNT</p>
    <h2>My Profile</h2>
    <div className="profile-card">
      <div className="avatar">{user.username?.[0]?.toUpperCase()}</div>
      <h3>{user.username}</h3>
      <p>{user.email}</p>
      <p>{user.address || "No address added"}</p>
      <span className="role">{user.role}</span>
    </div>
  </section>;
}

/* ========================================================
   ADMIN PANEL
   ======================================================== */
function Admin({ user }) {
  const [form, setForm] = useState({ title: "", author: "", price: "", desc: "", url: "", language: "English", category: "general" });
  const [message, setMessage] = useState("");
  const [code, setCode] = useState("");
  const [books, setBooks] = useState([]);

  async function load() { try { const r = await api.get("/books"); setBooks(r.data.data); } catch {} }
  useEffect(() => { load(); }, []);

  if (!user) return <section className="page"><h2>Please log in as an admin.</h2></section>;

  async function enableAdmin() {
    try { 
      const r = await api.post("/auth/make-admin", { code }); 
      setMessage(r.data.message); 
      window.location.reload(); 
    } catch (e) { 
      setMessage(e.response?.data?.message || "Could not enable admin"); 
    }
  }

  async function add(e) {
    e.preventDefault();
    try { 
      const r = await api.post("/books", { ...form, price: Number(form.price) }); 
      setMessage(r.data.message); 
      setForm({ title:"", author:"", price:"", desc:"", url:"", language:"English", category:"general" }); 
      load(); 
    } catch (e) { 
      setMessage(e.response?.data?.message || "Could not add book"); 
    }
  }

  async function remove(id) {
    try { await api.delete(`/books/${id}`); load(); }
    catch (e) { setMessage(e.response?.data?.message || "Delete failed"); }
  }

  function pickSampleImage(url) {
    setForm(prev => ({ ...prev, url }));
  }

  return <section className="page">
    <p className="eyebrow">MANAGEMENT</p>
    <h2>Admin Panel</h2>
    {user.role !== "admin" ? (
      <div className="auth-card">
        <p>Your account is not an admin account.</p>
        <label>Admin code<input value={code} onChange={e => setCode(e.target.value)} /></label>
        <button className="primary-btn" onClick={enableAdmin}>Enable admin</button>
      </div>
    ) : (
      <>
        <form className="admin-form" onSubmit={add}>
          <h3>Add a book</h3>
          {["title","author","price","url","language","category"].map(k => (
            <label key={k}>
              {k.toUpperCase()}
              <input 
                required={["title","author","price"].includes(k)} 
                type={k==="price"?"number":"text"} 
                value={form[k]} 
                placeholder={k === "url" ? "Paste image URL or click presets below" : ""}
                onChange={e => setForm({...form,[k]:e.target.value})} 
              />
            </label>
          ))}

          <div style={{ gridColumn: "1 / -1", margin: "4px 0 12px" }}>
            <small style={{ display: "block", marginBottom: "6px", color: "#64748b" }}>
              Quick image presets (click to insert):
            </small>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <button type="button" className="small-btn" onClick={() => pickSampleImage(BOOK_COVERS[0])}>Cover 1</button>
              <button type="button" className="small-btn" onClick={() => pickSampleImage(BOOK_COVERS[1])}>Cover 2</button>
              <button type="button" className="small-btn" onClick={() => pickSampleImage(BOOK_COVERS[2])}>Cover 3</button>
              <button type="button" className="small-btn" onClick={() => pickSampleImage(BOOK_COVERS[3])}>Cover 4</button>
              <button type="button" className="small-btn" onClick={() => pickSampleImage(BOOK_COVERS[4])}>Cover 5</button>
            </div>
          </div>

          <label className="wide">
            Description
            <textarea value={form.desc} onChange={e => setForm({...form,desc:e.target.value})} required />
          </label>
          <button className="primary-btn">Add Book</button>
        </form>

        <h3 className="list-title">Manage books</h3>
        {books.map(b => (
          <div className="admin-row" key={b._id}>
            <span>{b.title} — {b.author}</span>
            <button className="remove-btn" onClick={() => remove(b._id)}>Delete</button>
          </div>
        ))}
      </>
    )}
    {message && <p className="notice">{message}</p>}
  </section>;
}

export default App;