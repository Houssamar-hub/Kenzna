import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import toast from 'react-hot-toast';
import { formatPrice, formatDate, orderStatusMap } from './formatters';

/**
 * Helper to download an HTML element as PDF with A4 proportions
 */
const renderElementToPDF = async (element, filename) => {
  try {
    document.body.appendChild(element);

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 850,
    });

    document.body.removeChild(element);

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(filename);
    return true;
  } catch (err) {
    console.error('PDF Generation Error:', err);
    if (element && element.parentNode) {
      document.body.removeChild(element);
    }
    throw err;
  }
};

/**
 * Generate and download professional Order Invoice / Payment Receipt PDF
 */
export const downloadOrderInvoicePDF = async (order) => {
  const toastId = toast.loading('جاري تجهيز وتحميل الفاتورة PDF... 📄');
  try {
    const statusMeta = orderStatusMap[order.orderStatus] || orderStatusMap.Pending;
    const subtotal = order.items?.reduce((sum, it) => sum + (it.price * it.quantity), 0) || order.totalAmount;
    const shipping = order.shippingFee !== undefined ? order.shippingFee : 0;
    const discount = order.discount || 0;

    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.width = '800px';
    container.style.backgroundColor = '#ffffff';
    container.style.padding = '35px 40px';
    container.style.fontFamily = "'Cairo', 'Tajawal', sans-serif";
    container.style.direction = 'rtl';
    container.style.color = '#1c1917';
    container.style.boxSizing = 'border-box';

    container.innerHTML = `
      <div style="border: 2px solid #e7e5e4; border-radius: 20px; padding: 25px 30px; position: relative; background: #fafaf9;">
        
        <!-- Header / Brand -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px dashed #d6d3d1; padding-bottom: 20px;">
          <div>
            <div style="display: flex; align-items: center; gap: 10px;">
              <div style="width: 44px; height: 44px; background: linear-gradient(135deg, #b45309, #d97706); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 22px; font-weight: bold; box-shadow: 0 4px 10px rgba(180,83,9,0.2);">
                👑
              </div>
              <div>
                <h1 style="margin: 0; font-size: 26px; font-weight: 900; color: #451a03; letter-spacing: -0.5px;">كنزنا | KENZNA</h1>
                <p style="margin: 2px 0 0; font-size: 11px; color: #78716c;">فواكه جافة ومكسرات فاخرة - كنز من الطبيعة إلى بابك</p>
              </div>
            </div>
            <div style="margin-top: 12px; font-size: 10px; color: #78716c; line-height: 1.6;">
              <span>📍 الدار البيضاء، المملكة المغربية</span> • <span>📞 +212 600-000000</span><br/>
              <span>🌐 www.kenzna.ma</span> • <span>✉️ contact@kenzna.ma</span>
            </div>
          </div>

          <div style="text-align: left; background: white; padding: 12px 18px; border-radius: 14px; border: 1px solid #e7e5e4; box-shadow: 0 2px 8px rgba(0,0,0,0.03);">
            <div style="font-size: 11px; font-weight: bold; color: #b45309; text-transform: uppercase;">وصل طلب وفاتورة رسمية</div>
            <div style="font-size: 18px; font-weight: 900; font-family: monospace; color: #1c1917; margin-top: 4px;">#${order.orderNumber}</div>
            <div style="font-size: 10px; color: #78716c; margin-top: 4px;">التاريخ: ${formatDate(order.createdAt)}</div>
            <div style="margin-top: 8px; display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 10px; font-weight: bold; background: ${order.orderStatus === 'Delivered' ? '#d1fae5' : '#fef3c7'}; color: ${order.orderStatus === 'Delivered' ? '#065f46' : '#92400e'}; border: 1px solid ${order.orderStatus === 'Delivered' ? '#a7f3d0' : '#fde68a'};">
              حالة الطلب: ${statusMeta.label}
            </div>
          </div>
        </div>

        <!-- Customer & Order Information Grid -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0;">
          <div style="background: white; border-radius: 14px; padding: 14px; border: 1px solid #e7e5e4;">
            <div style="font-size: 11px; font-weight: bold; color: #b45309; margin-bottom: 8px; border-bottom: 1px solid #f5f5f4; padding-bottom: 4px;">👤 معلومات الزبون</div>
            <div style="font-size: 11px; line-height: 1.8; color: #292524;">
              <div><strong>الاسم:</strong> ${order.customerInfo?.fullName || order.user?.name || 'زبون كنزنا'}</div>
              <div><strong>الهاتف:</strong> <span style="font-family: monospace;">${order.customerInfo?.phone || order.user?.phone || 'غير مسجل'}</span></div>
              ${order.customerInfo?.email ? `<div><strong>البريد:</strong> ${order.customerInfo.email}</div>` : ''}
            </div>
          </div>

          <div style="background: white; border-radius: 14px; padding: 14px; border: 1px solid #e7e5e4;">
            <div style="font-size: 11px; font-weight: bold; color: #b45309; margin-bottom: 8px; border-bottom: 1px solid #f5f5f4; padding-bottom: 4px;">🚚 عنوان وطريقة التوصيل</div>
            <div style="font-size: 11px; line-height: 1.8; color: #292524;">
              <div><strong>المدينة:</strong> ${order.shippingAddress?.city || 'المغرب'}</div>
              <div><strong>العنوان:</strong> ${order.shippingAddress?.address || 'غير محدد'}</div>
              <div><strong>طريقة الدفع:</strong> الدفع نقداً عند الاستلام (COD) 💵</div>
            </div>
          </div>
        </div>

        <!-- Items Table -->
        <div style="background: white; border-radius: 14px; border: 1px solid #e7e5e4; overflow: hidden; margin-bottom: 20px;">
          <table style="width: 100%; border-collapse: collapse; text-align: right; font-size: 11px;">
            <thead>
              <tr style="background: #f5f5f4; color: #57534e; border-bottom: 1px solid #e7e5e4;">
                <th style="padding: 10px 14px;">#</th>
                <th style="padding: 10px 14px;">المنتج / النكهة</th>
                <th style="padding: 10px 14px; text-align: center;">الوزن</th>
                <th style="padding: 10px 14px; text-align: center;">الكمية</th>
                <th style="padding: 10px 14px; text-align: center;">سعر الوحدة</th>
                <th style="padding: 10px 14px; text-align: left;">المجموع</th>
              </tr>
            </thead>
            <tbody>
              ${order.items?.map((it, idx) => `
                <tr style="border-bottom: 1px solid #f5f5f4;">
                  <td style="padding: 10px 14px; color: #78716c; font-family: monospace;">${idx + 1}</td>
                  <td style="padding: 10px 14px; font-weight: bold; color: #1c1917;">${it.name}</td>
                  <td style="padding: 10px 14px; text-align: center; color: #57534e;"><span style="background: #f5f5f4; padding: 2px 8px; border-radius: 6px; font-size: 10px;">${it.weight || '250g'}</span></td>
                  <td style="padding: 10px 14px; text-align: center; font-family: monospace; font-weight: bold;">${it.quantity}</td>
                  <td style="padding: 10px 14px; text-align: center; font-family: monospace;">${it.price} د.م</td>
                  <td style="padding: 10px 14px; text-align: left; font-family: monospace; font-weight: bold; color: #b45309;">${it.price * it.quantity} د.م</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <!-- Calculations & Stamp -->
        <div style="display: flex; justify-content: space-between; align-items: flex-end; gap: 20px;">
          <!-- Seal / Guarantee & Barcode -->
          <div style="border: 2px dashed #b45309; border-radius: 14px; padding: 12px 18px; background: #fffbeb; width: 260px; text-align: center;">
            <div style="font-size: 11px; font-weight: 900; color: #b45309;">⭐ ضمان كنزنا للجودة 100% ⭐</div>
            <div style="font-size: 9px; color: #78350f; margin-top: 4px; line-height: 1.5;">
              منتجات طازجة ومختارة بعناية فائقة. يحق للزبون معاينة الطلب والتأكد منه عند الاستلام.
            </div>
            <!-- Barcode simulation -->
            <div style="margin-top: 8px; letter-spacing: 4px; font-family: monospace; font-size: 14px; font-weight: bold; color: #451a03; background: white; padding: 4px 8px; border-radius: 6px; border: 1px solid #fed7aa;">
              ||| | |||| || ||| | ||
            </div>
            <div style="margin-top: 4px; font-size: 8px; color: #a8a29e; font-family: monospace;">
              KENZNA-${order.orderNumber}
            </div>
          </div>

          <!-- Total Calculation Card -->
          <div style="background: white; border-radius: 14px; border: 1px solid #e7e5e4; padding: 14px 18px; width: 280px; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
            <div style="display: flex; justify-content: space-between; font-size: 11px; color: #78716c; margin-bottom: 6px;">
              <span>مجموع المنتجات:</span>
              <span style="font-family: monospace; font-weight: bold; color: #1c1917;">${subtotal} د.م</span>
            </div>
            
            <div style="display: flex; justify-content: space-between; font-size: 11px; color: #78716c; margin-bottom: 6px;">
              <span>مصاريف التوصيل:</span>
              <span style="font-family: monospace; font-weight: bold; color: #16a34a;">${shipping === 0 ? 'مجاني (0 د.م)' : `${shipping} د.م`}</span>
            </div>

            ${discount > 0 ? `
              <div style="display: flex; justify-content: space-between; font-size: 11px; color: #dc2626; margin-bottom: 6px;">
                <span>خصم الكوبون (${order.couponCode || ''}):</span>
                <span style="font-family: monospace; font-weight: bold;">-${discount} د.م</span>
              </div>
            ` : ''}

            <div style="border-top: 2px solid #f5f5f4; margin-top: 8px; padding-top: 8px; display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 12px; font-weight: 900; color: #451a03;">المبلغ الإجمالي للدفع:</span>
              <span style="font-size: 16px; font-weight: 900; font-family: monospace; color: #b45309;">${order.totalAmount} د.م</span>
            </div>
          </div>
        </div>

        <!-- Footer Notice -->
        <div style="margin-top: 25px; padding-top: 15px; border-top: 1px solid #e7e5e4; text-align: center; font-size: 9px; color: #a8a29e;">
          شكراً لاختياركم كنزنا! للاستفسارات أو خدمات ما بعد البيع، يرجى التواصل معنا عبر واتساب أو الهاتف على <strong>+212 600-000000</strong>.
        </div>
      </div>
    `;

    await renderElementToPDF(container, `فاتورة_كنزنا_${order.orderNumber}.pdf`);
    toast.success(`تم تحميل فاتورة الطلب #${order.orderNumber} بنجاح! 📄`, { id: toastId });
  } catch (err) {
    toast.error('حدث خطأ أثناء تحميل الفاتورة', { id: toastId });
  }
};

/**
 * Generate and download Sales & Performance Report PDF for Admin Dashboard
 */
export const downloadSalesReportPDF = async (orders = [], stats = {}) => {
  const toastId = toast.loading('جاري توليد تقرير المبيعات والأداء PDF... 📊');
  try {
    const today = new Date().toLocaleDateString('ar-MA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const totalSales = stats?.kpis?.totalSales || orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const totalOrdersCount = stats?.kpis?.totalOrders || orders.length;
    const deliveredCount = orders.filter((o) => o.orderStatus === 'Delivered').length;
    const pendingCount = orders.filter((o) => o.orderStatus === 'Pending').length;

    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.width = '850px';
    container.style.backgroundColor = '#ffffff';
    container.style.padding = '35px 40px';
    container.style.fontFamily = "'Cairo', 'Tajawal', sans-serif";
    container.style.direction = 'rtl';
    container.style.color = '#1c1917';
    container.style.boxSizing = 'border-box';

    container.innerHTML = `
      <div style="border: 2px solid #e7e5e4; border-radius: 20px; padding: 25px 30px; background: #fafaf9;">
        
        <!-- Report Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #b45309; padding-bottom: 15px;">
          <div>
            <h1 style="margin: 0; font-size: 24px; font-weight: 900; color: #451a03;">📊 تقرير أداء ومبيعات متجر كنزنا</h1>
            <p style="margin: 3px 0 0; font-size: 11px; color: #78716c;">تقرير رسمي صادر من لوحة تحكم الإدارة (Kenzna Executive Analytics)</p>
          </div>
          <div style="text-align: left; font-size: 10px; color: #78716c;">
            <div><strong>تاريخ الإصدار:</strong> ${today}</div>
            <div><strong>نطاق البيانات:</strong> شامل جميع الطلبات</div>
          </div>
        </div>

        <!-- KPI Cards Grid -->
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin: 20px 0;">
          <div style="background: white; border-radius: 12px; padding: 12px; border: 1px solid #e7e5e4; text-align: center;">
            <span style="font-size: 10px; color: #78716c; display: block;">إجمالي المبيعات</span>
            <strong style="font-size: 16px; font-weight: 900; font-family: monospace; color: #b45309;">${formatPrice(totalSales)}</strong>
          </div>

          <div style="background: white; border-radius: 12px; padding: 12px; border: 1px solid #e7e5e4; text-align: center;">
            <span style="font-size: 10px; color: #78716c; display: block;">إجمالي الطلبات</span>
            <strong style="font-size: 16px; font-weight: 900; font-family: monospace; color: #1c1917;">${totalOrdersCount} طلب</strong>
          </div>

          <div style="background: white; border-radius: 12px; padding: 12px; border: 1px solid #e7e5e4; text-align: center;">
            <span style="font-size: 10px; color: #78716c; display: block;">طلبات تم تسليمها</span>
            <strong style="font-size: 16px; font-weight: 900; font-family: monospace; color: #16a34a;">${deliveredCount} طلب</strong>
          </div>

          <div style="background: white; border-radius: 12px; padding: 12px; border: 1px solid #e7e5e4; text-align: center;">
            <span style="font-size: 10px; color: #78716c; display: block;">طلبات قيد المعالجة</span>
            <strong style="font-size: 16px; font-weight: 900; font-family: monospace; color: #d97706;">${pendingCount} طلب</strong>
          </div>
        </div>

        <!-- Orders Detailed Breakdown -->
        <div style="background: white; border-radius: 14px; border: 1px solid #e7e5e4; overflow: hidden; margin-bottom: 20px;">
          <div style="padding: 10px 14px; background: #f5f5f4; border-bottom: 1px solid #e7e5e4; font-size: 11px; font-weight: bold; color: #451a03;">
            سجل المبيعات والطلبات الأخيرة
          </div>
          <table style="width: 100%; border-collapse: collapse; text-align: right; font-size: 10px;">
            <thead>
              <tr style="background: #fafaf9; color: #57534e; border-bottom: 1px solid #e7e5e4;">
                <th style="padding: 8px 10px;">رقم الطلب</th>
                <th style="padding: 8px 10px;">الزبون</th>
                <th style="padding: 8px 10px;">المدينة</th>
                <th style="padding: 8px 10px; text-align: center;">الأصناف</th>
                <th style="padding: 8px 10px; text-align: center;">المبلغ</th>
                <th style="padding: 8px 10px;">التاريخ</th>
                <th style="padding: 8px 10px; text-align: center;">الحالة</th>
              </tr>
            </thead>
            <tbody>
              ${orders.slice(0, 15).map((o) => `
                <tr style="border-bottom: 1px solid #f5f5f4;">
                  <td style="padding: 8px 10px; font-family: monospace; font-weight: bold; color: #b45309;">${o.orderNumber}</td>
                  <td style="padding: 8px 10px; font-weight: bold;">${o.customerInfo?.fullName || o.user?.name || 'عميل'}</td>
                  <td style="padding: 8px 10px; color: #57534e;">${o.shippingAddress?.city || '-'}</td>
                  <td style="padding: 8px 10px; text-align: center; font-family: monospace;">${o.items?.length || 1}</td>
                  <td style="padding: 8px 10px; text-align: center; font-family: monospace; font-weight: bold; color: #1c1917;">${o.totalAmount} د.م</td>
                  <td style="padding: 8px 10px; color: #78716c; font-family: monospace;">${formatDate(o.createdAt)}</td>
                  <td style="padding: 8px 10px; text-align: center;">
                    <span style="display: inline-block; padding: 2px 6px; border-radius: 6px; font-size: 9px; font-weight: bold; background: #f5f5f4; color: #44403c;">
                      ${orderStatusMap[o.orderStatus]?.label || o.orderStatus}
                    </span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <!-- Footer & Signature -->
        <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 15px; border-top: 1px solid #e7e5e4; font-size: 9px; color: #78716c;">
          <div>نظام إدارة متجر كنزنا الإلكتروني • تم التوليد آلياً</div>
          <div style="text-align: left; font-weight: bold; color: #451a03;">
            ختم واعتماد الإدارة: <span style="font-family: monospace;">KENZNA E-COM MGMT</span>
          </div>
        </div>
      </div>
    `;

    const cleanDate = new Date().toISOString().slice(0, 10);
    await renderElementToPDF(container, `تقرير_مبيعات_كنزنا_${cleanDate}.pdf`);
    toast.success('تم تحميل تقرير المبيعات والأداء PDF بنجاح! 📊', { id: toastId });
  } catch (err) {
    toast.error('حدث خطأ أثناء تحميل التقرير', { id: toastId });
  }
};
