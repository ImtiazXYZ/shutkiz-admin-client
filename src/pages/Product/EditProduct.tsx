import { StyleProvider } from '@ant-design/cssinjs';
import { Select, Skeleton, Switch } from 'antd';
import axios from 'axios';
import JoditEditor from 'jodit-react';
import { useEffect, useRef, useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { IoIosRemove } from 'react-icons/io';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminAuth from '../../components/Admin/AdminAuth';
import ImagePreviewer from '../../components/Image/ImagePreviewer';
import MultipleImagePreviewer from '../../components/Image/MultipleImagePreviewer';
import InputSelect from '../../components/Input/InputSelect';

function EditProduct() {
  const { id } = useParams();
  const { http } = AdminAuth();
  const [name, setName] = useState('');
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [create, setCreate] = useState<boolean>(false);
  const [clearImage, setClearImage] = useState(false);
  const [selectedImages, setSelectedImages] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [categoryId, setCategoryId] = useState<string>('');
  const [subcategoryId, setSubcategoryId] = useState<string>('');
  const [fields, setFields] = useState<any[]>([
    {
      weight: '',
      stock: '',
      regular_price: '',
      discount_price: '',
      discountEnabled: false,
    },
  ]);
  const [isVariable, setIsVariable] = useState(false);
  const editor = useRef(null);
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const [reset, setReset] = useState(false);
  const navigate = useNavigate();
  const [product, setProduct] = useState([]);
  const baseURL = import.meta.env.VITE_SERVER_BASE_URL;
  const [isLoading, setIsLoading] = useState(true);
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipeIds, setSelectedRecipeIds] = useState([]);

  const validate = () => {
    const newErrors = {};
    if (!name) newErrors.name = 'Name is required.';
    if (!categoryId) newErrors.category_id = 'Category is required.';
    // if (!subcategoryId) newErrors.subcategory_id = "Subcategory is required.";
    if (!content) newErrors.description = 'Description is required.';
    if (selectedImages.length === 0)
      newErrors.gallery_images = 'At least one gallery image is required.';
    if (fields.length === 0)
      newErrors.stock_price = 'At least one stock price is required.';

    const stockErrors = fields.map((stock, index) => {
      const stockErrors = {};
      if (!stock.weight) stockErrors.weight = `Weight is required`;
      if (!stock.stock) stockErrors.stock = `Stock is required`;
      if (!stock.regular_price)
        stockErrors.regular_price = `Regular price is required`;
      if (stock.discountEnabled && !stock.discount_price)
        stockErrors.discount_price = `Discount price is required`;
      return stockErrors;
    });

    stockErrors.forEach((err, index) => {
      if (Object.keys(err).length > 0) {
        newErrors[`stock_${index}`] = err;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    fetchProduct();
    fetchCategories();
    fetchRecipes();
  }, []);

  const fetchRecipes = () => {
    http
      .get('/admin/all-recipes')
      .then((res) => {
        setRecipes(res.data);
        //console.log(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchProduct = () => {
    http
      .get(`/admin/products/${id}/edit`)
      .then((res) => {
        //console.log(res.data);
        setProduct(res.data);
        setName(res.data.name);
        setCategoryId(res.data.category_id);
        setSubcategoryId(res.data.subcategory_id);
        getCatCorrSubcat(res.data.category_id);
        setContent(res.data.description);
        setFields(
          res.data.stocks.map((stock) => ({
            weight: stock.weight,
            stock: stock.stock,
            regular_price: stock.regular_price,
            discount_price: stock.discount_price,
            discountEnabled: stock.is_discount == 1 ? true : false,
          })),
        );

        if (res.data.type == 'variable') {
          setIsVariable(true);
        } else {
          setIsVariable(false);
        }
        if (res.data && res.data.recipes) {
          const ids = res.data.recipes.map((recipe) => recipe.id);
          setSelectedRecipeIds(ids); // Set selected recipe IDs from product data
        }

        const parsedGalleryImages = JSON.parse(res.data.gallery_images).map(
          (imageUrl: string, index: number) => ({
            uid: index.toString(),
            name: `image-${index + 1}.jpeg`,
            status: 'done',
            url: baseURL + '/' + imageUrl,
          }),
        );

        setSelectedImages(parsedGalleryImages);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error.data);
      });
  };

  //Images
  const handleFileListChange = (files: any[]) => {
    setSelectedImages(files);
  };

  const handleThumbmail = (imageFile: File | null) => {
    setThumbnail(imageFile);
  };

  //Fetch Category & Subcategory

  const fetchCategories = () => {
    http
      .get('/admin/all-categories')
      .then((res) => {
        setCategories(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleCategoryId = (id) => {
    setCategoryId(id);
    getCatCorrSubcat(id);
  };
  const handleSubcategoryId = (id) => {
    setSubcategoryId(id);
  };
  const getCatCorrSubcat = (id) => {
    http.get(`/admin/categories/${id}`).then((res) => {
      setSubcategories(res.data.subcategories);
    });
  };

  //Handle Fileds Adding And Removing
  const handleAddField = () => {
    setFields([
      ...fields,
      {
        weight: '',
        stock: '',
        regular_price: '',
        discount_price: '',
        discountEnabled: false,
      },
    ]);
  };

  const handleRemoveField = (index) => {
    if (isVariable && fields.length <= 2) {
      return;
    }
    const newFields = [...fields];
    newFields.splice(index, 1);
    setFields(newFields);
  };

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const newFields = [...fields];
    newFields[index][name] = value;
    setFields(newFields);
  };

  // Toggle discount field enabled/disabled
  const handleToggleDiscount = (index) => {
    const newFields = [...fields];
    newFields[index].discountEnabled = !newFields[index].discountEnabled;
    setFields(newFields);
  };

  const resetFieldsAfterSuccess = () => {
    setFields(() => [
      {
        weight: '',
        stock: '',
        regular_price: '',
        discount_price: '',
        discountEnabled: false,
      },
    ]);
  };

  //Haldle simple or variable product
  const handleVariable = (checked: boolean) => {
    setIsVariable(checked);
    if (checked) {
      setFields([
        {
          weight: '',
          stock: '',
          regular_price: '',
          discount_price: '',
          discountEnabled: false,
        },
        {
          weight: '',
          stock: '',
          regular_price: '',
          discount_price: '',
          discountEnabled: false,
        },
      ]);
    } else {
      setFields([
        {
          weight: '',
          stock: '',
          regular_price: '',
          discount_price: '',
          discountEnabled: false,
        },
      ]);
    }
  };

  //Config for editor
  const config = {
    readonly: false,
    height: 400,
    toolbarSticky: false,
    uploader: {
      insertImageAsBase64URI: true,
    },
  };

  //Submit product from
  const productSubmitHandler = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const formData = new FormData();
    formData.append('name', name);
    formData.append('category_id', categoryId);
    if (subcategoryId != null) {
      formData.append('subcategory_id', subcategoryId);
    }
    formData.append('description', content);
    formData.append('isVariable', isVariable ? 1 : 0);
    if (selectedRecipeIds && selectedRecipeIds.length > 0) {
      selectedRecipeIds.forEach((id) => {
        formData.append('recipe_ids[]', id);
      });
    }
    formData.append('_method', 'PUT');
    if (thumbnail && thumbnail instanceof File) {
      formData.append('thumbnail', thumbnail);
    }
    const normalizedFields = fields.map((field) => ({
      weight: field.weight,
      stock: field.stock,
      regular_price: field.regular_price,
      discount_price: field.discount_price,
      discountEnabled: field.discountEnabled ? 1 : 0,
    }));

    formData.append('stock_price', JSON.stringify(normalizedFields));

    selectedImages.forEach((file) => {
      if (file.originFileObj) {
        formData.append('gallery_images[]', file.originFileObj);
      }
    });

    http
      .post(`/admin/products/${id}`, formData)
      .then((res) => {
        toast.success('Product Updated', { autoClose: 2000 });
        navigate('/product/all');
      })
      .catch((error) => {
        if (
          axios.isAxiosError(error) &&
          error.response &&
          error.response.data
        ) {
          setErrors(error.response.data.errors || {});
        } else {
          console.error(error);
        }
        //console.log(error);
      });
  };

  const handleChange = (value) => {
    setSelectedRecipeIds(value);
  };

  return (
    <main className="">
      <div className="flex flex-col gap-9 max-w-[900px] mx-auto">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Update Product
            </h3>
          </div>
          {isLoading ? (
            <div className="p-5">
              <Skeleton paragraph={{ rows: 8 }} />
            </div>
          ) : (
            <form onSubmit={productSubmitHandler}>
              <div className="p-6.5">
                <div className="section-1 shadow-md  p-5 rounded-lg">
                  <h2 className="pb-3 font-semibold text-black">
                    Product Info
                  </h2>
                  <div className="mb-4.5">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                    {errors.name && (
                      <span className="text-sm text-red-500">
                        {errors.name}
                      </span>
                    )}
                  </div>

                  <div className="mb-4.5 flex gap-x-5">
                    <div className="w-full">
                      <InputSelect
                        label="Select Category"
                        categories={categories}
                        handleCategoryId={handleCategoryId}
                        subcategory={product.category_id}
                        reset={reset}
                      />

                      {errors.category_id && (
                        <span className="text-sm text-red-500">
                          {errors.category_id}
                        </span>
                      )}
                    </div>
                    <div className="w-full">
                      <InputSelect
                        label="Select Sub Category"
                        categories={subcategories}
                        subcategory={`${product.subcategory_id}`}
                        handleCategoryId={handleSubcategoryId}
                        reset={reset}
                      />
                      {errors.subcategory_id && (
                        <span className="text-sm text-red-500">
                          {errors.subcategory_id}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="section-2 p-5 rounded-lg mt-10 shadow-md">
                  <h2 className="pb-3 font-semibold text-black">
                    Product Images
                  </h2>
                  <div className="mb-4.5">
                    <ImagePreviewer
                      onImageSelect={handleThumbmail}
                      label="Thumbnail"
                      clearImage={clearImage}
                      currentImage={
                        product.thumbnail
                          ? `${baseURL}/${product.thumbnail}`
                          : null
                      }
                    />
                    {thumbnail && (
                      <p className="mt-2 text-sm text-gray-500">
                        Selected Image: {thumbnail.name}
                      </p>
                    )}
                    {errors.thumbnail && (
                      <span className="text-sm text-red-500">
                        {errors.thumbnail}
                      </span>
                    )}
                  </div>
                  <div className="mb-4.5">
                    <MultipleImagePreviewer
                      onFileListChange={handleFileListChange}
                      label="Gallery Images"
                      selectedImages={selectedImages}
                    />
                    {errors.gallery_images && (
                      <span className="text-sm text-red-500">
                        {errors.gallery_images}
                      </span>
                    )}
                  </div>
                </div>

                <div className="section-3 p-5 rounded-lg mt-10 shadow-md">
                  <div className="flex justify-between pb-5">
                    <h2 className="pb-3 font-semibold text-black">
                      Product Stocks & Price
                    </h2>
                    {errors.stock_price && <span>{errors.stock_price}</span>}
                    <div className="flex items-center gap-x-2">
                      <StyleProvider hashPriority="high">
                        <span>Variable Product</span>{' '}
                        <Switch
                          checked={isVariable}
                          onChange={handleVariable}
                        />
                      </StyleProvider>
                    </div>
                  </div>

                  {fields.map((field, index) => (
                    <div className="flex gap-x-5 relative pt-10">
                      <div className="mb-4.5 w-full">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Weight
                        </label>
                        <input
                          name="weight"
                          value={field.weight}
                          onChange={(event) => handleInputChange(index, event)}
                          type="text"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                        {errors[`stock_${index}`]?.weight && (
                          <span className="text-sm text-red-500">
                            {errors[`stock_${index}`].weight}
                          </span>
                        )}
                      </div>
                      <div className="mb-4.5 w-full">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Stock
                        </label>
                        <input
                          name="stock"
                          value={field.stock}
                          onChange={(event) => handleInputChange(index, event)}
                          type="text"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                        {errors[`stock_${index}`]?.stock && (
                          <span className="text-sm text-red-500">
                            {errors[`stock_${index}`].stock}
                          </span>
                        )}
                      </div>
                      <div className="mb-4.5 w-full">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Regular Price
                        </label>
                        <input
                          name="regular_price"
                          value={field.regular_price}
                          onChange={(event) => handleInputChange(index, event)}
                          type="text"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                        {errors[`stock_${index}`]?.regular_price && (
                          <span className="text-sm text-red-500">
                            {errors[`stock_${index}`].regular_price}
                          </span>
                        )}
                      </div>
                      <div className="mb-4.5 w-full">
                        <div className="flex justify-between">
                          <label className="mb-2.5 block text-black dark:text-white">
                            Discount Price
                          </label>
                          <label>
                            <Switch
                              checked={fields[index].discountEnabled}
                              onChange={() => handleToggleDiscount(index)}
                            />
                          </label>
                        </div>
                        <input
                          name="discount_price"
                          value={field.discount_price}
                          disabled={!field.discountEnabled}
                          onChange={(event) => handleInputChange(index, event)}
                          type="text"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                        {errors[`stock_${index}`]?.discount_price && (
                          <span className="text-sm text-red-500">
                            {errors[`stock_${index}`].discount_price}
                          </span>
                        )}
                      </div>

                      {isVariable && (
                        <div className="absolute -top-3 right-0 flex gap-x-2">
                          <div
                            onClick={handleAddField}
                            className="bg-black w-[30px] h-[30px] rounded-full flex justify-center items-center text-white cursor-pointer"
                          >
                            <AiOutlinePlus />
                          </div>
                          {fields.length > 1 && (
                            <div
                              onClick={() => handleRemoveField(index)}
                              className="bg-black w-[30px] h-[30px] rounded-full flex justify-center items-center text-white cursor-pointer"
                            >
                              <IoIosRemove />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="section-3 p-5 rounded-lg mt-10 shadow-md">
                  <h2 className="pb-3 font-semibold text-black">
                    Product Description
                  </h2>
                  <div className="mb-4.5">
                    <JoditEditor
                      ref={editor}
                      value={content}
                      config={config}
                      tabIndex={1}
                      onBlur={(newContent) => setContent(newContent)}
                    />
                  </div>
                  {errors.descriptionn && (
                    <span className="text-sm text-red-500">
                      {errors.description}
                    </span>
                  )}
                </div>

                <div className="section-3 p-5 rounded-lg mt-10 shadow-md">
                  <h2 className="pb-3 font-semibold text-black">
                    Product Related Recipe
                  </h2>
                  <div className="mb-4.5">
                    <StyleProvider hashPriority="high">
                      <Select
                        mode="multiple"
                        showSearch
                        style={{ width: '100%' }}
                        placeholder="Select one or more recipes"
                        onChange={handleChange}
                        value={selectedRecipeIds}
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          option.children
                            .toLowerCase()
                            .includes(input.toLowerCase()) ||
                          option.value
                            .toString()
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                      >
                        {recipes.map((recipe) => (
                          <Select.Option key={recipe.id} value={recipe.id}>
                            {recipe.title}
                          </Select.Option>
                        ))}
                      </Select>
                    </StyleProvider>
                  </div>
                </div>

                <button
                  type="submit"
                  className="flex w-[200px] justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 mt-10"
                >
                  {create ? 'Updating...' : 'Update'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}

export default EditProduct;
