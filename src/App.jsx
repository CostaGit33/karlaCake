import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Plus, List, Cake, Search, Filter, Edit, Trash2, Star, TrendingUp, BarChart3, PieChart, Download, Upload, Settings, Bell, Users, DollarSign } from 'lucide-react';
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Badge } from './components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog';
import { Alert, AlertDescription } from './components/ui/alert';
import { Progress } from './components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell, LineChart, Line, Pie } from 'recharts';
import logo from './assets/futponts_large.png';
import './App.css';

function App() {
  const [pedidos, setPedidos] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingPedido, setEditingPedido] = useState(null);
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  const [clientes, setClientes] = useState([]);

  // Formulário state
  const [formData, setFormData] = useState({
    nomeCliente: '',
    entrada: '',
    dataEntrega: '',
    arte: '',
    tamanho: '',
    recheio1: '',
    recheio2: '',
    adicional: '',
    telefone: '',
    observacoes: ''
  });

  // Carregar dados do localStorage
  useEffect(() => {
    const savedPedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
    const savedClientes = JSON.parse(localStorage.getItem('clientes')) || [];
    setPedidos(savedPedidos);
    setClientes(savedClientes);
  }, []);

  // Salvar pedidos no localStorage
  const savePedidos = (newPedidos) => {
    setPedidos(newPedidos);
    localStorage.setItem('pedidos', JSON.stringify(newPedidos));
  };

  // Salvar clientes no localStorage
  const saveClientes = (newClientes) => {
    setClientes(newClientes);
    localStorage.setItem('clientes', JSON.stringify(newClientes));
  };

  // Opções de tamanho com preços
  const tamanhoOptions = [
    { value: '10cm - R$75,00', label: '10 cm – 8 fatias – R$ 75,00', price: 75 },
    { value: '12cm - R$100,00', label: '12 cm – 10/12 fatias – R$ 100,00', price: 100 },
    { value: '15cm - R$120,00', label: '15 cm – 15 fatias – R$ 120,00', price: 120 },
    { value: '18cm - R$150,00', label: '18 cm – 20 fatias – R$ 150,00', price: 150 },
    { value: '20cm - R$185,00', label: '20 cm – 30 fatias – R$ 185,00', price: 185 },
    { value: '25cm - R$210,00', label: '25 cm – 40/45 fatias – R$ 210,00', price: 210 }
  ];

  // Opções de recheio
  const recheioOptions = [
    'Chocolate Meio Amargo',
    'Chocolate Ao Leite',
    'Chocolate Branco',
    'Beijinho',
    'Ninho',
    '4 Leites',
    'Doce Leite',
    'Brigadeiro de Paçoca'
  ];

  // Opções de adicional
  const adicionalOptions = [
    { value: 'Nenhum', price: 0 },
    { value: 'Morango in Natura', price: 10 },
    { value: 'Geleia Morango', price: 10 },
    { value: 'Abacaxi', price: 10 },
    { value: 'Ameixa', price: 10 },
    { value: 'Nutella', price: 10 }
  ];

  // Calcular preço total
  const calcularPrecoTotal = (tamanho, adicional) => {
    const tamanhoObj = tamanhoOptions.find(t => t.value === tamanho);
    const adicionalObj = adicionalOptions.find(a => a.value === adicional);
    return (tamanhoObj?.price || 0) + (adicionalObj?.price || 0);
  };

  // Resetar formulário
  const resetForm = () => {
    setFormData({
      nomeCliente: '',
      entrada: '',
      dataEntrega: '',
      arte: '',
      tamanho: '',
      recheio1: '',
      recheio2: '',
      adicional: '',
      telefone: '',
      observacoes: ''
    });
    setEditingPedido(null);
  };

  // Submeter formulário
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.nomeCliente || !formData.entrada || !formData.dataEntrega || 
        !formData.arte || !formData.tamanho || !formData.recheio1 || !formData.recheio2) {
      setFeedback({ message: 'Por favor, preencha todos os campos obrigatórios.', type: 'error' });
      return;
    }

    const precoTotal = calcularPrecoTotal(formData.tamanho, formData.adicional);
    const pedido = {
      id: editingPedido ? editingPedido.id : Date.now(),
      ...formData,
      entrada: parseFloat(formData.entrada),
      precoTotal,
      status: 'Pendente',
      dataCriacao: editingPedido ? editingPedido.dataCriacao : new Date().toISOString()
    };

    // Atualizar lista de clientes
    if (!clientes.find(c => c.nome === formData.nomeCliente)) {
      const novoCliente = {
        id: Date.now(),
        nome: formData.nomeCliente,
        telefone: formData.telefone,
        totalPedidos: 1,
        ultimoPedido: new Date().toISOString()
      };
      saveClientes([...clientes, novoCliente]);
    }

    let newPedidos;
    if (editingPedido) {
      newPedidos = pedidos.map(p => p.id === editingPedido.id ? pedido : p);
      setFeedback({ message: '✅ Pedido atualizado com sucesso!', type: 'success' });
    } else {
      newPedidos = [...pedidos, pedido];
      setFeedback({ message: '✅ Pedido adicionado com sucesso!', type: 'success' });
    }

    savePedidos(newPedidos);
    resetForm();
    setIsAddDialogOpen(false);
    
    setTimeout(() => setFeedback({ message: '', type: '' }), 3000);
  };

  // Editar pedido
  const handleEdit = (pedido) => {
    setFormData(pedido);
    setEditingPedido(pedido);
    setIsAddDialogOpen(true);
  };

  // Deletar pedido
  const handleDelete = (id) => {
    const newPedidos = pedidos.filter(p => p.id !== id);
    savePedidos(newPedidos);
    setFeedback({ message: '🗑️ Pedido removido com sucesso!', type: 'success' });
    setTimeout(() => setFeedback({ message: '', type: '' }), 3000);
  };

  // Filtrar pedidos
  const filteredPedidos = pedidos.filter(pedido => {
    const matchesSearch = pedido.nomeCliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pedido.arte.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !filterDate || pedido.dataEntrega === filterDate;
    return matchesSearch && matchesDate;
  });

  // Agrupar pedidos por data
  const groupedPedidos = filteredPedidos.reduce((acc, pedido) => {
    const date = pedido.dataEntrega;
    if (!acc[date]) acc[date] = [];
    acc[date].push(pedido);
    return acc;
  }, {});

  // Estatísticas
  const totalPedidos = pedidos.length;
  const totalReceita = pedidos.reduce((sum, pedido) => sum + (pedido.precoTotal || pedido.entrada), 0);
  const pedidosHoje = pedidos.filter(p => p.dataEntrega === new Date().toISOString().split('T')[0]).length;
  const ticketMedio = totalPedidos > 0 ? totalReceita / totalPedidos : 0;

  // Dados para gráficos
  const pedidosPorMes = pedidos.reduce((acc, pedido) => {
    const mes = new Date(pedido.dataCriacao).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
    acc[mes] = (acc[mes] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(pedidosPorMes).map(([mes, quantidade]) => ({
    mes,
    quantidade
  }));

  const receitaPorMes = pedidos.reduce((acc, pedido) => {
    const mes = new Date(pedido.dataCriacao).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
    acc[mes] = (acc[mes] || 0) + (pedido.precoTotal || pedido.entrada);
    return acc;
  }, {});

  const receitaChartData = Object.entries(receitaPorMes).map(([mes, receita]) => ({
    mes,
    receita
  }));

  const saboresMaisVendidos = pedidos.reduce((acc, pedido) => {
    const sabores = [pedido.recheio1, pedido.recheio2].filter(Boolean);
    sabores.forEach(sabor => {
      acc[sabor] = (acc[sabor] || 0) + 1;
    });
    return acc;
  }, {});

  const saboresChartData = Object.entries(saboresMaisVendidos)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([sabor, quantidade]) => ({
      sabor,
      quantidade
    }));

  const COLORS = ['#d04a7c', '#f06292', '#e91e63', '#ad1457', '#880e4f'];

  // Export de dados
  const exportData = () => {
    const dataStr = JSON.stringify({ pedidos, clientes }, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `karla-cake-backup-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <motion.header 
        className="glass-effect cake-shadow sticky top-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.img 
                src={logo} 
                alt="Karla.Cake" 
                className="h-12 w-12 floating-animation"
                whileHover={{ scale: 1.1 }}
              />
              <div>
                <h1 className="text-2xl font-bold gradient-text">Karla.Cake</h1>
                <p className="text-sm text-muted-foreground">Confeitaria Digital</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="hidden sm:flex">
                <TrendingUp className="w-4 h-4 mr-1" />
                {totalPedidos} pedidos
              </Badge>
              <Badge variant="outline" className="hidden sm:flex">
                R$ {totalReceita.toFixed(2)}
              </Badge>
              <Button variant="ghost" size="sm" onClick={exportData}>
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Feedback */}
      <AnimatePresence>
        {feedback.message && (
          <motion.div
            className="fixed top-20 right-4 z-50"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
          >
            <Alert className={`${feedback.type === 'error' ? 'border-destructive' : 'border-green-500'}`}>
              <AlertDescription>{feedback.message}</AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-[600px] mx-auto">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <Star className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="agenda" className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Agenda</span>
            </TabsTrigger>
            <TabsTrigger value="pedidos" className="flex items-center space-x-2">
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">Pedidos</span>
            </TabsTrigger>
            <TabsTrigger value="relatorios" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Relatórios</span>
            </TabsTrigger>
            <TabsTrigger value="clientes" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Clientes</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard */}
          <TabsContent value="dashboard" className="space-y-6">
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="futuristic-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de Pedidos</CardTitle>
                  <Cake className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold gradient-text">{totalPedidos}</div>
                  <Progress value={(totalPedidos / 100) * 100} className="mt-2" />
                </CardContent>
              </Card>

              <Card className="futuristic-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold gradient-text">R$ {totalReceita.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Ticket médio: R$ {ticketMedio.toFixed(2)}
                  </p>
                </CardContent>
              </Card>

              <Card className="futuristic-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pedidos Hoje</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold gradient-text">{pedidosHoje}</div>
                </CardContent>
              </Card>

              <Card className="futuristic-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Clientes</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold gradient-text">{clientes.length}</div>
                </CardContent>
              </Card>
            </motion.div>

            <Card className="futuristic-card">
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full pulse-glow" onClick={resetForm}>
                        <Plus className="w-4 h-4 mr-2" />
                        Novo Pedido
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>
                          {editingPedido ? 'Editar Pedido' : 'Novo Pedido'}
                        </DialogTitle>
                      </DialogHeader>
                      <PedidoForm 
                        formData={formData}
                        setFormData={setFormData}
                        onSubmit={handleSubmit}
                        tamanhoOptions={tamanhoOptions}
                        recheioOptions={recheioOptions}
                        adicionalOptions={adicionalOptions}
                        isEditing={!!editingPedido}
                        calcularPrecoTotal={calcularPrecoTotal}
                      />
                    </DialogContent>
                  </Dialog>

                  <Button variant="outline" onClick={() => setActiveTab('agenda')}>
                    <Calendar className="w-4 h-4 mr-2" />
                    Ver Agenda
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Agenda */}
          <TabsContent value="agenda" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="futuristic-card">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                    <CardTitle className="flex items-center space-x-2">
                      <Calendar className="w-5 h-5" />
                      <span>Agenda de Pedidos</span>
                    </CardTitle>
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          placeholder="Buscar cliente ou arte..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 w-full sm:w-64"
                        />
                      </div>
                      <div className="relative">
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          type="date"
                          value={filterDate}
                          onChange={(e) => setFilterDate(e.target.value)}
                          className="pl-10 w-full sm:w-auto"
                        />
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {Object.keys(groupedPedidos).length === 0 ? (
                    <div className="text-center py-12">
                      <Cake className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">Nenhum pedido encontrado</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {Object.keys(groupedPedidos).sort().map((date) => (
                        <motion.div
                          key={date}
                          className="space-y-4"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <h3 className="text-lg font-semibold flex items-center space-x-2">
                            <Calendar className="w-5 h-5 text-primary" />
                            <span>{new Date(date + 'T00:00:00').toLocaleDateString('pt-BR', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}</span>
                          </h3>
                          <div className="grid gap-4">
                            {groupedPedidos[date].map((pedido) => (
                              <PedidoCard 
                                key={pedido.id} 
                                pedido={pedido} 
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                              />
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Lista de Pedidos */}
          <TabsContent value="pedidos" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="futuristic-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <List className="w-5 h-5" />
                    <span>Todos os Pedidos</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {filteredPedidos.length === 0 ? (
                    <div className="text-center py-12">
                      <List className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">Nenhum pedido encontrado</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredPedidos.map((pedido) => (
                        <PedidoCard 
                          key={pedido.id} 
                          pedido={pedido} 
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                          showDate
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Relatórios */}
          <TabsContent value="relatorios" className="space-y-6">
            <motion.div
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="futuristic-card">
                <CardHeader>
                  <CardTitle>Pedidos por Mês</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="quantidade" fill="#d04a7c" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="futuristic-card">
                <CardHeader>
                  <CardTitle>Receita por Mês</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={receitaChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`R$ ${value.toFixed(2)}`, 'Receita']} />
                      <Line type="monotone" dataKey="receita" stroke="#d04a7c" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="futuristic-card lg:col-span-2">
                <CardHeader>
                  <CardTitle>Sabores Mais Vendidos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsPieChart>
                        <Pie
                          data={saboresChartData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="quantidade"
                          label={({ sabor, quantidade }) => `${sabor}: ${quantidade}`}
                        >
                          {saboresChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                    <div className="space-y-2">
                      {saboresChartData.map((item, index) => (
                        <div key={item.sabor} className="flex items-center space-x-2">
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span className="text-sm">{item.sabor}: {item.quantidade} pedidos</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Clientes */}
          <TabsContent value="clientes" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="futuristic-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-5 h-5" />
                    <span>Clientes</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {clientes.length === 0 ? (
                    <div className="text-center py-12">
                      <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">Nenhum cliente cadastrado</p>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {clientes.map((cliente) => (
                        <div key={cliente.id} className="futuristic-card p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold gradient-text">{cliente.nome}</h4>
                              <p className="text-sm text-muted-foreground">{cliente.telefone}</p>
                            </div>
                            <div className="text-right">
                              <Badge>{cliente.totalPedidos} pedidos</Badge>
                              <p className="text-xs text-muted-foreground mt-1">
                                Último: {new Date(cliente.ultimoPedido).toLocaleDateString('pt-BR')}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

// Componente do formulário de pedido
function PedidoForm({ formData, setFormData, onSubmit, tamanhoOptions, recheioOptions, adicionalOptions, isEditing, calcularPrecoTotal }) {
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const precoTotal = calcularPrecoTotal(formData.tamanho, formData.adicional);

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nomeCliente">Nome do Cliente *</Label>
          <Input
            id="nomeCliente"
            value={formData.nomeCliente}
            onChange={(e) => handleChange('nomeCliente', e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="telefone">Telefone</Label>
          <Input
            id="telefone"
            value={formData.telefone}
            onChange={(e) => handleChange('telefone', e.target.value)}
            placeholder="(11) 99999-9999"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dataEntrega">Data de Entrega *</Label>
          <Input
            id="dataEntrega"
            type="date"
            value={formData.dataEntrega}
            onChange={(e) => handleChange('dataEntrega', e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="arte">Arte *</Label>
          <Input
            id="arte"
            value={formData.arte}
            onChange={(e) => handleChange('arte', e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tamanho">Tamanho do Bolo *</Label>
          <Select value={formData.tamanho} onValueChange={(value) => handleChange('tamanho', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tamanho" />
            </SelectTrigger>
            <SelectContent>
              {tamanhoOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="recheio1">Recheio 1 *</Label>
          <Select value={formData.recheio1} onValueChange={(value) => handleChange('recheio1', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o primeiro recheio" />
            </SelectTrigger>
            <SelectContent>
              {recheioOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="recheio2">Recheio 2 *</Label>
          <Select value={formData.recheio2} onValueChange={(value) => handleChange('recheio2', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o segundo recheio" />
            </SelectTrigger>
            <SelectContent>
              {recheioOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="adicional">Adicional (R$10,00)</Label>
          <Select value={formData.adicional} onValueChange={(value) => handleChange('adicional', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um adicional" />
            </SelectTrigger>
            <SelectContent>
              {adicionalOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.value} {option.price > 0 && `(+R$ ${option.price.toFixed(2)})`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="entrada">Valor de Entrada (R$) *</Label>
          <Input
            id="entrada"
            type="number"
            step="0.01"
            min="0"
            value={formData.entrada}
            onChange={(e) => handleChange('entrada', e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="observacoes">Observações</Label>
        <Input
          id="observacoes"
          value={formData.observacoes}
          onChange={(e) => handleChange('observacoes', e.target.value)}
          placeholder="Observações adicionais..."
        />
      </div>

      {precoTotal > 0 && (
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm font-medium">
            Preço Total Estimado: <span className="text-lg font-bold text-primary">R$ {precoTotal.toFixed(2)}</span>
          </p>
        </div>
      )}

      <Button type="submit" className="w-full">
        {isEditing ? 'Atualizar Pedido' : 'Adicionar Pedido'}
      </Button>
    </form>
  );
}

// Componente do card de pedido
function PedidoCard({ pedido, onEdit, onDelete, showDate = false }) {
  return (
    <motion.div
      className="futuristic-card p-4 smooth-transition hover:scale-[1.02]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start space-y-4 sm:space-y-0">
        <div className="flex-1 space-y-2">
          <div className="flex items-center space-x-2">
            <h4 className="font-semibold text-lg gradient-text">{pedido.nomeCliente}</h4>
            {showDate && (
              <Badge variant="outline">
                {new Date(pedido.dataEntrega + 'T00:00:00').toLocaleDateString('pt-BR')}
              </Badge>
            )}
            <Badge className="bg-green-100 text-green-800">
              {pedido.status || 'Pendente'}
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <div>
              <span className="font-medium">Tamanho:</span> {pedido.tamanho}
            </div>
            <div>
              <span className="font-medium">Arte:</span> {pedido.arte}
            </div>
            <div>
              <span className="font-medium">Recheios:</span> {pedido.recheio1} + {pedido.recheio2}
            </div>
            <div>
              <span className="font-medium">Adicional:</span> {pedido.adicional || 'Nenhum'}
            </div>
            {pedido.telefone && (
              <div>
                <span className="font-medium">Telefone:</span> {pedido.telefone}
              </div>
            )}
            {pedido.observacoes && (
              <div className="sm:col-span-2">
                <span className="font-medium">Obs:</span> {pedido.observacoes}
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge className="bg-green-100 text-green-800">
              Entrada: R$ {pedido.entrada.toFixed(2)}
            </Badge>
            {pedido.precoTotal && (
              <Badge className="bg-blue-100 text-blue-800">
                Total: R$ {pedido.precoTotal.toFixed(2)}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(pedido)}
            className="touch-target"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(pedido.id)}
            className="touch-target"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export default App;

