import React, { useState } from 'react';
import { Plus, X, Upload, Palette, Ruler, Package } from 'lucide-react';

interface ProductFormProps {
  product: any;
  setProduct: (product: any) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isEditing?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({
  product,
  setProduct,
  onSubmit,
  onCancel,
  isEditing = false
}) => {
  const [newColor, setNewColor] = useState({ name: '', images: [] as string[] });
  const [newSize, setNewSize] = useState('');
  const [newMaterial, setNewMaterial] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, colorIndex?: number) => {
    const files = e.target.files;
    if (files) {
      const imageUrls = Array.from(files).map(file => URL.createObjectURL(file));
      
      if (colorIndex !== undefined) {
        // Ajouter des images à une couleur spécifique
        const updatedColors = [...product.options.colors];
        updatedColors[colorIndex].images = [...updatedColors[colorIndex].images, ...imageUrls];
        setProduct({
          ...product,
          options: { ...product.options, colors: updatedColors }
        });
      } else {
        // Image principale du produit
        setProduct({ ...product, image: imageUrls[0] });
      }
    }
  };

  const addColor = () => {
    if (newColor.name.trim()) {
      setProduct({
        ...product,
        options: {
          ...product.options,
          colors: [...product.options.colors, { name: newColor.name, images: [] }]
        }
      });
      setNewColor({ name: '', images: [] });
    }
  };

  const removeColor = (index: number) => {
    const updatedColors = product.options.colors.filter((_: any, i: number) => i !== index);
    setProduct({
      ...product,
      options: { ...product.options, colors: updatedColors }
    });
  };

  const addSize = () => {
    if (newSize.trim()) {
      setProduct({
        ...product,
        options: {
          ...product.options,
          sizes: [...product.options.sizes, newSize.trim()]
        }
      });
      setNewSize('');
    }
  };

  const removeSize = (index: number) => {
    const updatedSizes = product.options.sizes.filter((_: any, i: number) => i !== index);
    setProduct({
      ...product,
      options: { ...product.options, sizes: updatedSizes }
    });
  };

  const addMaterial = () => {
    if (newMaterial.trim()) {
      setProduct({
        ...product,
        options: {
          ...product.options,
          materials: [...product.options.materials, newMaterial.trim()]
        }
      });
      setNewMaterial('');
    }
  };

  const removeMaterial = (index: number) => {
    const updatedMaterials = product.options.materials.filter((_: any, i: number) => i !== index);
    setProduct({
      ...product,
      options: { ...product.options, materials: updatedMaterials }
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {isEditing ? 'Modifier le produit' : 'Ajouter un nouveau produit'}
      </h2>

      <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-6">
        {/* Informations de base */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom du produit *
            </label>
            <input
              type="text"
              value={product.name}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Marque
            </label>
            <input
              type="text"
              value={product.brand}
              onChange={(e) => setProduct({ ...product, brand: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            value={product.description}
            onChange={(e) => setProduct({ ...product, description: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            required
          />
        </div>

        {/* Catégorie personnalisée */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Catégorie *
          </label>
          <input
            type="text"
            value={product.category}
            onChange={(e) => setProduct({ ...product, category: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="Ex: Téléphones, Vêtements, Électronique..."
            required
          />
        </div>

        {/* Prix */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prix de vente (FCFA) *
            </label>
            <input
              type="number"
              min={0}
              value={product.price === 0 ? '' : product.price}
              onChange={(e) => {
                const value = Math.max(0, Number(e.target.value));
                setProduct({ ...product, price: value });
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prix original (FCFA)
            </label>
            <input
              type="number"
              min={0}
              value={product.originalPrice === 0 ? '' : product.originalPrice}
              onChange={(e) => {
                const value = Math.max(0, Number(e.target.value));
                setProduct({ ...product, originalPrice: value });
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Statut du stock
            </label>
            <select
              value={product.stockStatus}
              onChange={(e) => setProduct({ ...product, stockStatus: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="in_stock">En stock</option>
              <option value="low_stock">Stock faible</option>
              <option value="out_of_stock">Rupture de stock</option>
            </select>
          </div>
        </div>

        {/* Quantité en stock (seulement si en stock) */}
        {product.stockStatus !== 'out_of_stock' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantité en stock
            </label>
            <input
              type="number"
              min={0}
              value={product.stockQuantity === 0 ? '' : product.stockQuantity}
              onChange={(e) => {
                const value = Math.max(0, Number(e.target.value));
                setProduct({ ...product, stockQuantity: value });
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
        )}

        {/* Image principale */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image principale
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            {product.image && (
              <img
                src={product.image}
                alt="Aperçu"
                className="w-20 h-20 object-cover rounded-lg border"
              />
            )}
          </div>
        </div>

        {/* Options de couleur */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Palette className="h-5 w-5 mr-2" />
            Options de couleur
          </h3>
          
          <div className="space-y-4">
            {product.options.colors.map((color: any, index: number) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-gray-700">{color.name}</span>
                  <button
                    type="button"
                    onClick={() => removeColor(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                {/* Images pour cette couleur */}
                <div className="space-y-2">
                  <label className="block text-sm text-gray-600">Images pour {color.name}:</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleImageUpload(e, index)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  {color.images.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {color.images.map((img: string, imgIndex: number) => (
                        <img
                          key={imgIndex}
                          src={img}
                          alt={`${color.name} ${imgIndex + 1}`}
                          className="w-16 h-16 object-cover rounded border"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newColor.name}
                onChange={(e) => setNewColor({ ...newColor, name: e.target.value })}
                placeholder="Nom de la couleur"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
              />
              <button
                type="button"
                onClick={addColor}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Options de taille */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Ruler className="h-5 w-5 mr-2" />
            Options de taille
          </h3>
          
          <div className="space-y-4">
            {product.options.sizes.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.options.sizes.map((size: string, index: number) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg"
                  >
                    <span className="text-sm font-medium">{size}</span>
                    <button
                      type="button"
                      onClick={() => removeSize(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newSize}
                onChange={(e) => setNewSize(e.target.value)}
                placeholder="Ex: S, M, L, XL, 42, 43..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
              />
              <button
                type="button"
                onClick={addSize}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Options de matériau */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Package className="h-5 w-5 mr-2" />
            Options de matériau
          </h3>
          
          <div className="space-y-4">
            {product.options.materials.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.options.materials.map((material: string, index: number) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg"
                  >
                    <span className="text-sm font-medium">{material}</span>
                    <button
                      type="button"
                      onClick={() => removeMaterial(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newMaterial}
                onChange={(e) => setNewMaterial(e.target.value)}
                placeholder="Ex: Coton, Cuir, Plastique..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
              />
              <button
                type="button"
                onClick={addMaterial}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
          >
            {isEditing ? 'Mettre à jour' : 'Ajouter le produit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm; 