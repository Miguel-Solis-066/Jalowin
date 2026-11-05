'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Producto {
  id: number
  sku: string
  nombre: string
  precio: int | number
  stock: number
}

interface ItemCarrito {
  producto: Producto
  cantidad: number
}

export default function Home() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [carrito, setCarrito] = useState<ItemCarrito[]>([])
  const [cargando, setCargando] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    async function obtenerProductos() {
      try {
        const { data, error } = await supabase.from('productos').select('*')
        if (error) throw error
        setProductos(data || [])
      } catch (err: any) {
        console.error('Error al cargar productos:', err)
        setErrorMsg(err.message || 'Error al conectar con Supabase')
      } finally {
        setCargando(false)
      }
    }
    obtenerProductos()
  }, [])

  const agregarAlCarrito = (prod: Producto) => {
    setCarrito(prev => {
      const existe = prev.find(item => item.producto.id === prod.id)
      if (existe) {
        return prev.map(item => 
          item.producto.id === prod.id 
            ? { ...item, cantidad: item.cantidad + 1 } 
            : item
        )
      }
      return [...prev, { producto: prod, cantidad: 1 }]
    })
  }

  const totalCarrito = carrito.reduce((acc, item) => acc + (item.producto.precio * item.cantidad), 0)

  // Asignar un icono o emoji representativo según el SKU o nombre para darle vista colorida
  const obtenerImagenHalloween = (sku: string) => {
    switch(sku) {
      case 'HAL-001': return '🎃';
      case 'HAL-002': return '🧛‍♂️';
      case 'HAL-003': return '💀';
      case 'HAL-004': return '🍬';
      case 'HAL-005': return '🩸';
      default: return '👻';
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/40 to-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Header POS */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-orange-500/30 p-4 sticky top-0 z-10 shadow-xl shadow-orange-500/5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-3xl animate-bounce">🎃</span>
            <div>
              <h1 className="text-xl font-black tracking-wider text-orange-500">PRODELEC</h1>
              <p className="text-xs text-purple-300 font-medium">Piloto POS Jalowin ⚡</p>
            </div>
          </div>
          <span className="bg-orange-500/20 text-orange-300 border border-orange-500/40 px-3 py-1 rounded-full text-xs font-bold tracking-wide shadow-inner">
            🟢 En Línea (Supabase)
          </span>
        </div>
      </header>

      {/* Layout Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6" suppressHydrationWarning>
        
        {/* Catálogo de Productos */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">Catálogo de Temporada</h2>
              <p className="text-xs text-slate-400">Selecciona los artículos para armar el ticket</p>
            </div>
            <span className="text-xs bg-purple-900/60 border border-purple-500/30 px-3 py-1.5 rounded-xl font-bold text-purple-200">
              {productos.length} Activos
            </span>
          </div>

          {cargando && (
            <div className="flex flex-col items-center justify-center py-20 text-orange-400 gap-3">
              <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="font-medium text-sm">Cargando magia de la base de datos...</p>
            </div>
          )}

          {errorMsg && (
            <div className="bg-red-950/60 border border-red-500/60 text-red-200 p-4 rounded-2xl mb-6 shadow-lg">
              <p className="font-bold flex items-center gap-2">⚠️ Error de conexión:</p>
              <p className="text-xs font-mono mt-1 text-red-300">{errorMsg}</p>
            </div>
          )}

          {!cargando && !errorMsg && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {productos.map((prod) => (
                <div 
                  key={prod.id} 
                  className="bg-slate-900/90 border border-slate-800/80 hover:border-orange-500/60 rounded-3xl p-5 transition-all duration-300 shadow-xl hover:shadow-orange-500/10 flex flex-col justify-between group relative overflow-hidden"
                >
                  {/* Resplandor de fondo al pasar el mouse */}
                  <div className="absolute -right-10 -top-10 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl group-hover:bg-orange-500/20 transition-all"></div>

                  <div>
                    {/* Fila superior: Imagen/Icono y SKU */}
                    <div className="flex justify-between items-center mb-3">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500/20 to-purple-600/20 border border-orange-500/30 flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform">
                        {obtenerImagenHalloween(prod.sku)}
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-mono bg-slate-800 text-orange-400 px-2.5 py-1 rounded-lg border border-slate-700">
                          {prod.sku}
                        </span>
                        <div className="mt-1">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            prod.stock > 0 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-red-500/20 text-red-300'
                          }`}>
                            Stock: {prod.stock}
                          </span>
                        </div>
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-slate-100 group-hover:text-orange-400 transition-colors">
                      {prod.nombre}
                    </h3>
                  </div>

                  <div className="flex justify-between items-center mt-5 pt-4 border-t border-slate-800/80">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">Precio</span>
                      <span className="text-2xl font-black text-emerald-400 tracking-tight">
                        ${Number(prod.precio).toFixed(2)}
                      </span>
                    </div>
                    <button 
                      onClick={() => agregarAlCarrito(prod)}
                      className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-extrabold px-4 py-2.5 rounded-2xl text-xs transition-all shadow-lg shadow-orange-500/20 hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5"
                    >
                      <span>🛒</span> Agregar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Panel de Ticket / Carrito */}
        <aside className="bg-slate-900/90 border border-slate-800/80 rounded-3xl p-5 flex flex-col justify-between h-fit sticky top-24 shadow-2xl backdrop-blur-md">
          <div>
            <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
              <h2 className="font-extrabold text-lg text-white flex items-center gap-2">
                🛍️ <span className="text-orange-400">Ticket</span> Actual
              </h2>
              <span className="text-xs bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2.5 py-1 rounded-xl font-bold">
                {carrito.reduce((acc, i) => acc + i.cantidad, 0)} arts
              </span>
            </div>

            {carrito.length === 0 ? (
              <div className="text-center py-16 text-slate-500 text-xs flex flex-col items-center gap-2">
                <span className="text-3xl">🧾</span>
                <span>El ticket está vacío.<br/>Agrega productos del catálogo.</span>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[42vh] overflow-y-auto pr-1">
                {carrito.map((item) => (
                  <div key={item.producto.id} className="flex justify-between items-center bg-slate-950/80 p-3 rounded-2xl border border-slate-800 hover:border-slate-700 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{obtenerImagenHalloween(item.producto.sku)}</span>
                      <div>
                        <p className="text-xs font-bold text-slate-200">{item.producto.nombre}</p>
                        <p className="text-[11px] text-orange-400 font-mono font-semibold">${Number(item.producto.precio).toFixed(2)} × {item.cantidad}</p>
                      </div>
                    </div>
                    <span className="font-black text-emerald-400 text-sm">
                      ${(Number(item.producto.precio) * item.cantidad).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-slate-800 pt-4 mt-6">
            <div className="flex justify-between items-center mb-4 bg-slate-950/50 p-3 rounded-2xl border border-slate-800/60">
              <span className="text-slate-400 font-semibold text-xs uppercase tracking-wider">Total a Pagar:</span>
              <span className="text-2xl font-black text-emerald-400 tracking-tight">${totalCarrito.toFixed(2)}</span>
            </div>
            <button 
              disabled={carrito.length === 0}
              className={`w-full py-3.5 rounded-2xl font-black text-sm transition-all shadow-xl tracking-wide ${
                carrito.length > 0 
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 shadow-emerald-500/20 cursor-pointer hover:scale-[1.02] active:scale-[0.98]' 
                  : 'bg-slate-800/60 text-slate-600 cursor-not-allowed border border-slate-800'
              }`}
            >
              ⚡ Cobrar Ticket
            </button>
          </div>
        </aside>

      </main>
    </div>
  )
}