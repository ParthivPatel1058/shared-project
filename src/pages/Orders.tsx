import { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle, Truck, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Order {
  id: string;
  order_number: string;
  items: any[];
  total_amount: number;
  status: string;
  created_at: string;
}

const Orders = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadOrders();
      
      // Set up real-time subscription for order updates
      const channel = supabase
        .channel('orders-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'orders',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            console.log('Order update received:', payload);
            loadOrders();
          }
        )
        .subscribe();
      
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const loadOrders = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setOrders((data || []) as Order[]);
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error(language === 'en' 
        ? 'Failed to load orders' 
        : 'ऑर्डर लोड करने में विफल'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      case 'in_transit': return <Truck className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    if (language === 'en') {
      return status.replace('_', ' ').toUpperCase();
    }
    const statusMap: Record<string, string> = {
      pending: 'लंबित',
      accepted: 'स्वीकृत',
      in_transit: 'ट्रांज़िट में',
      delivered: 'डिलीवर किया गया',
      cancelled: 'रद्द'
    };
    return statusMap[status] || status;
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'cancelled' })
        .eq('id', orderId);

      if (error) throw error;

      toast.success(language === 'en' 
        ? 'Order cancelled successfully' 
        : 'ऑर्डर सफलतापूर्वक रद्द किया गया'
      );
      loadOrders();
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error(language === 'en' 
        ? 'Failed to cancel order' 
        : 'ऑर्डर रद्द करने में विफल'
      );
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="pt-8 pb-12 px-4 container mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {language === 'en' ? 'My Orders' : 'मेरे ऑर्डर'}
          </h1>
          <p className="text-xl text-muted-foreground">
            {language === 'en' ? 'Track your order history' : 'अपने ऑर्डर का इतिहास देखें'}
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto" />
            <p className="text-muted-foreground mt-4">
              {language === 'en' ? 'Loading orders...' : 'ऑर्डर लोड हो रहे हैं...'}
            </p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-24 w-24 text-muted-foreground/20 mx-auto mb-4" />
            <p className="text-lg font-semibold text-muted-foreground mb-2">
              {language === 'en' ? 'No orders yet' : 'अभी तक कोई ऑर्डर नहीं'}
            </p>
            <p className="text-sm text-muted-foreground">
              {language === 'en' 
                ? 'Start shopping to see your orders here' 
                : 'अपने ऑर्डर देखने के लिए खरीदारी शुरू करें'}
            </p>
          </div>
        ) : (
          <div className="space-y-4 max-w-4xl mx-auto">
            {orders.map((order) => (
              <Card key={order.id} className="glass p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-foreground">
                      {language === 'en' ? 'Order' : 'ऑर्डर'} #{order.order_number}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString(language === 'en' ? 'en-IN' : 'hi-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(order.status)}
                      <Badge variant="secondary" className="text-xs">
                        {getStatusText(order.status)}
                      </Badge>
                    </div>
                    
                    {(order.status === 'pending' || order.status === 'accepted') && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="ml-auto text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                          >
                            <X className="h-4 w-4 mr-1" />
                            {language === 'en' ? 'Cancel' : 'रद्द करें'}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              {language === 'en' ? 'Cancel Order?' : 'ऑर्डर रद्द करें?'}
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              {language === 'en' 
                                ? 'Are you sure you want to cancel this order? This action cannot be undone.' 
                                : 'क्या आप वाकई इस ऑर्डर को रद्द करना चाहते हैं? यह क्रिया पूर्ववत नहीं की जा सकती।'}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>
                              {language === 'en' ? 'No, keep order' : 'नहीं, ऑर्डर रखें'}
                            </AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleCancelOrder(order.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              {language === 'en' ? 'Yes, cancel order' : 'हां, ऑर्डर रद्द करें'}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {order.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-3 text-sm">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-12 h-12 object-contain rounded bg-white" 
                      />
                      <div className="flex-1">
                        <p className="font-medium text-foreground">
                          {language === 'en' ? item.name : item.nameHi}
                        </p>
                        <p className="text-muted-foreground">
                          {language === 'en' ? 'Qty' : 'मात्रा'}: {item.quantity}
                        </p>
                      </div>
                      <p className="font-bold text-foreground">₹{item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4 flex justify-between items-center">
                  <span className="font-semibold text-foreground">
                    {language === 'en' ? 'Total Amount' : 'कुल राशि'}
                  </span>
                  <span className="text-2xl font-bold text-primary">₹{order.total_amount}</span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
