import Controller from '@utils/interfaces/controller';
import UserController from '@resources/user/controller';
import ProductController from '@resources/product/controller';
import DilutionController from '@resources/dilution/controller';
import StoreController from '@resources/store/controller';
import TagController from '@resources/tag/controller';
import CategoryController from '@resources/category/controller';
import BatchController from '@resources/batch/controller';
import ColorController from '@resources/color/controller';
import CustomerController from '@resources/customer/controller';
import PillController from '@resources/pill/controller';
import ProductPriceController from '@resources/product-price/controller';
import SizeController from '@resources/size/controller';
import TabletController from '@resources/tablet/controller';
import PrescriptionController from '@resources/prescription/controller';
import DosageController from '@resources/dosage/controller';
import SaleController from '@resources/sale/controller';
import ReceiptController from '@resources/receipt/controller';
import RoleController from '@resources/role/controller';
import AppointmentController from '@resources/appointment/controller';
import SettingsController from '@resources/settings/controller';
import PricesController from '@resources/price/controller';
import CommentsController from '@resources/comment/controller';
import TenantController from '@resources/tenant/controller';
import BrandController from '@resources/brand/controller';

const controllers: Controller[] = [
  new UserController(),
  new ProductController(),
  new DilutionController(),
  new StoreController(),
  new TagController(),
  new CategoryController(),
  new BatchController(),
  new ColorController(),
  new CustomerController(),
  new PillController(),
  new ProductPriceController(),
  new SizeController(),
  new TabletController(),
  new PrescriptionController(),
  new DosageController(),
  new SaleController(),
  new ReceiptController(),
  new RoleController(),
  new SettingsController(),
  new AppointmentController(),
  new PricesController(),
  new CommentsController(),
  new TenantController(),
  new BrandController(),
];

export default controllers;
