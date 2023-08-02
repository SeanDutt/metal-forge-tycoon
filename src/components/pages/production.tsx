import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase.ts';
import Card from '../card.tsx';
import React from 'react';

export interface BuildingData {
    name: string;
    imageUrl: string;
    baseUpgradeCost: Record<string, number>;
    upgradeCostScaling: number;
    productionRate: number;
  }

const ProductionBuildings = () => {
  const [productionBuildings, setProductionBuildings] = useState<BuildingData[]>([]);

  useEffect(() => {
    const fetchProductionBuildings = async () => {
      try {
        const productionBuildingsCollectionRef = collection(db, 'buildings');
        const productionBuildingsQuerySnapshot = await getDocs(productionBuildingsCollectionRef);
        const productionBuildingsData = productionBuildingsQuerySnapshot.docs.map((doc) => doc.data());
        setProductionBuildings(productionBuildingsData as BuildingData[]);
      } catch (error) {
        console.error('Error fetching production buildings:', error);
      }
    };

    fetchProductionBuildings();
  }, []);

  return (
    <div>
      <h2>Production Buildings (Not yet implemented)</h2>
      {productionBuildings.map((building) => (
        <Card
          key={building.name}
          icon={require(`../../data/buildingIcons/${building.imageUrl}`)}
          primaryText={building.name}
          link={`/Buildings/${building.name}`}
        />
      ))}
    </div>
  );
};

export default ProductionBuildings;
