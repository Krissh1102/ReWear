import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  ShoppingBag, 
  TrendingUp, 
  Settings, 
  Eye, 
  Trash2, 
  CheckCircle, 
  XCircle,
  Plus,
  Edit,
  BarChart3
} from 'lucide-react';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });

  // REMOVE static/mock data
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalItems: 0,
    activeSwaps: 0,
    completedSwaps: 0,
    pendingApprovals: 0,
    revenue: 0,
    textileWasteSaved: 0
  });
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Authentication
  const handleLogin = async () => {
    // Simple mock authentication - replace with real auth
    if (loginForm.username === 'admin' && loginForm.password === 'password') {
      setIsAuthenticated(true);
      setLoading(true);
      try {
        const [usersRes, itemsRes, categoriesRes, statsRes] = await Promise.all([
          fetch('/api/users'),
          fetch('/api/items'),
          fetch('/api/categories'), // If you have a categories API
          fetch('/api/stats') // To be created for dashboard metrics
        ]);
        const usersData = await usersRes.json();
        const itemsData = await itemsRes.json();
        let categoriesData = [];
        if (categoriesRes.ok) {
          categoriesData = await categoriesRes.json();
        } else {
          categoriesData = [
            { id: 1, name: 'Tops', itemCount: 0, active: true },
            { id: 2, name: 'Jeans & Pants', itemCount: 0, active: true },
            { id: 3, name: 'Dresses', itemCount: 0, active: true },
            { id: 4, name: 'Outerwear', itemCount: 0, active: true }
          ];
        }
        let statsData = {
          totalUsers: usersData.length,
          totalItems: itemsData.length,
          activeSwaps: 0,
          completedSwaps: 0,
          pendingApprovals: itemsData.filter(i => i.status === 'pending').length,
          revenue: 0,
          textileWasteSaved: 0
        };
        if (statsRes.ok) {
          statsData = await statsRes.json();
        }
        setUsers(usersData);
        setItems(itemsData);
        setCategories(categoriesData);
        setDashboardData(statsData);
      } catch (err) {
        console.error('Failed to fetch admin data:', err);
      } finally {
        setLoading(false);
      }
    } else {
      alert('Invalid credentials. Use admin/password for demo.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setLoginForm({ username: '', password: '' });
  };

  // Management functions should call API and update state
  const handleItemAction = async (itemId, action) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/items/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: action })
      });
      if (!res.ok) throw new Error('Failed to update item');
      const updated = await res.json();
      setItems(items => items.map(item => item._id === itemId ? updated : item));
    } catch (err) {
      alert('Failed to update item');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/items/${itemId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete item');
      setItems(items => items.filter(item => item._id !== itemId));
    } catch (err) {
      alert('Failed to delete item');
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (userId, action) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: action })
      });
      if (!res.ok) throw new Error('Failed to update user');
      const updated = await res.json();
      setUsers(users => users.map(user => user._id === userId ? updated : user));
    } catch (err) {
      alert('Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/users/${userId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete user');
      setUsers(users => users.filter(user => user._id !== userId));
    } catch (err) {
      alert('Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  // Category management (API if available, else local)
  const handleCategoryToggle = async (categoryId) => {
    // If you have a categories API, PATCH the category
    setCategories(categories.map(cat =>
      cat.id === categoryId ? { ...cat, active: !cat.active } : cat
    ));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="Username"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                />
              </div>
              <div>
                <Input
                  type="password"
                  placeholder="Password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                />
              </div>
              <Button onClick={handleLogin} className="w-full">Login</Button>
              <p className="text-sm text-gray-600 text-center">
                Demo credentials: admin / password
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">ReWear Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, Admin</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="items">Items</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardData.totalUsers}</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Items</CardTitle>
                  <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardData.totalItems}</div>
                  <p className="text-xs text-muted-foreground">+8% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Swaps</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardData.activeSwaps}</div>
                  <p className="text-xs text-muted-foreground">+23% from last week</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Waste Saved</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardData.textileWasteSaved}T</div>
                  <p className="text-xs text-muted-foreground">Textile waste</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Pending Approvals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-600">{dashboardData.pendingApprovals}</div>
                  <p className="text-sm text-gray-600">Items awaiting approval</p>
                  <Button className="mt-4" onClick={() => setActiveTab('items')}>
                    Review Items
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">New user registered</span>
                      <span className="text-xs text-gray-500">2 hours ago</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Item approved</span>
                      <span className="text-xs text-gray-500">4 hours ago</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Swap completed</span>
                      <span className="text-xs text-gray-500">6 hours ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Name</th>
                        <th className="text-left p-2">Email</th>
                        <th className="text-left p-2">Status</th>
                        <th className="text-left p-2">Swaps</th>
                        <th className="text-left p-2">Join Date</th>
                        <th className="text-left p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(user => (
                        <tr key={user._id} className="border-b">
                          <td className="p-2 font-medium">{user.name}</td>
                          <td className="p-2">{user.email}</td>
                          <td className="p-2">
                            <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                              {user.status}
                            </Badge>
                          </td>
                          <td className="p-2">{user.swaps}</td>
                          <td className="p-2">{user.joinDate}</td>
                          <td className="p-2">
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleUserAction(user._id, user.status === 'active' ? 'suspended' : 'active')}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => handleDeleteUser(user._id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Items Tab */}
          <TabsContent value="items" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Item Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Title</th>
                        <th className="text-left p-2">User</th>
                        <th className="text-left p-2">Category</th>
                        <th className="text-left p-2">Status</th>
                        <th className="text-left p-2">Condition</th>
                        <th className="text-left p-2">Points</th>
                        <th className="text-left p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map(item => (
                        <tr key={item._id} className="border-b">
                          <td className="p-2 font-medium">{item.title}</td>
                          <td className="p-2">{item.user}</td>
                          <td className="p-2">{item.category}</td>
                          <td className="p-2">
                            <Badge 
                              variant={
                                item.status === 'approved' ? 'default' : 
                                item.status === 'pending' ? 'secondary' : 'destructive'
                              }
                            >
                              {item.status}
                            </Badge>
                          </td>
                          <td className="p-2">{item.condition}</td>
                          <td className="p-2">{item.points}</td>
                          <td className="p-2">
                            <div className="flex space-x-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleItemAction(item._id, 'approved')}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleItemAction(item._id, 'rejected')}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleDeleteItem(item._id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Category Management</CardTitle>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Category
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map(category => (
                    <Card key={category.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium">{category.name}</h3>
                          <Badge variant={category.active ? 'default' : 'secondary'}>
                            {category.active ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{category.itemCount} items</p>
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleCategoryToggle(category.id)}
                          >
                            {category.active ? 'Deactivate' : 'Activate'}
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <div className="text-4xl font-bold text-green-600">+24%</div>
                    <p className="text-sm text-gray-600">User growth this month</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Tops</span>
                      <span className="font-medium">245 items</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Jeans & Pants</span>
                      <span className="font-medium">189 items</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Dresses</span>
                      <span className="font-medium">156 items</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Platform Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Site Title</label>
                  <Input defaultValue="ReWear - Clothing Swap Platform" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Default Points per Item</label>
                  <Input type="number" defaultValue="25" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Maintenance Mode</label>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="maintenance" />
                    <label htmlFor="maintenance" className="text-sm">Enable maintenance mode</label>
                  </div>
                </div>
                <Button>Save Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminPanel;