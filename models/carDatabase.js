const fs = require('fs').promises;
const path = require('path');

class CarDatabase {
  constructor() {
    this.dataPath = path.join(__dirname, '../data/cars.json');
  }

  async getAllCars() {
    try {
      const data = await fs.readFile(this.dataPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading cars data:', error);
      return [];
    }
  }

  async getCarById(id) {
    const cars = await this.getAllCars();
    return cars.find(car => car.id === parseInt(id));
  }

  async addCar(carData) {
    try {
      const cars = await this.getAllCars();
      const newId = Math.max(...cars.map(car => car.id), 0) + 1;
      const newCar = { id: newId, ...carData };
      cars.push(newCar);
      await fs.writeFile(this.dataPath, JSON.stringify(cars, null, 2));
      return newCar;
    } catch (error) {
      console.error('Error adding car:', error);
      throw error;
    }
  }

  async updateCar(id, carData) {
    try {
      const cars = await this.getAllCars();
      const carIndex = cars.findIndex(car => car.id === parseInt(id));
      
      if (carIndex === -1) {
        return null;
      }

      cars[carIndex] = { ...cars[carIndex], ...carData, id: parseInt(id) };
      await fs.writeFile(this.dataPath, JSON.stringify(cars, null, 2));
      return cars[carIndex];
    } catch (error) {
      console.error('Error updating car:', error);
      throw error;
    }
  }

  async deleteCar(id) {
    try {
      const cars = await this.getAllCars();
      const carIndex = cars.findIndex(car => car.id === parseInt(id));
      
      if (carIndex === -1) {
        return null;
      }

      const deletedCar = cars.splice(carIndex, 1)[0];
      await fs.writeFile(this.dataPath, JSON.stringify(cars, null, 2));
      return deletedCar;
    } catch (error) {
      console.error('Error deleting car:', error);
      throw error;
    }
  }
}

module.exports = CarDatabase;