import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
import matplotlib
import matplotlib.pyplot as plt
matplotlib.use('TkAgg')

plt.ion()

#importar archivos excel DECLARACION DE VARIABLES
ventas_2023 = pd.read_excel(r'C:\Users\Fabian\Downloads\BASES_PRUEBA\BASES\SALES_2023.xlsx')
ventas_2024 = pd.read_excel(r'C:\Users\Fabian\Downloads\BASES_PRUEBA\BASES\SALES_2024.xlsx')
ventas_2025 = pd.read_excel(r'C:\Users\Fabian\Downloads\BASES_PRUEBA\BASES\SALES_2025.xlsx')
targets = pd.read_excel(r'C:\Users\Fabian\Downloads\BASES_PRUEBA\BASES\Targets.xlsx')
dimension_tables = pd.read_excel(r'C:\Users\Fabian\Downloads\BASES_PRUEBA\BASES\DimensionTables.xlsx')

#Limpiar los datos
def limpiar_datos(datos_anuales):
    datos_anuales.dropna(subset=['Qty Itens', 'Unit Price'], inplace=True)
    datos_anuales['Issue Date'] = pd.to_datetime(datos_anuales['Issue Date'])
    return datos_anuales

# Calcular la columna 'Ventas' para cada archivo
def calcular_ventas(datos_anuales):
    datos_anuales['Ventas'] = datos_anuales['Qty Itens'] * datos_anuales['Unit Price']
    return datos_anuales

# Realizar regresión lineal para predecir las ventas del próximo mes
def predecir_ventas_siguiente_mes(datos_anuales):
    datos_anuales['Mes'] = datos_anuales['Issue Date'].dt.month
    ventas_por_mes = datos_anuales.groupby('Mes')['Ventas'].sum().reset_index()
    X = ventas_por_mes[['Mes']]
    y = ventas_por_mes['Ventas']
    modelo = LinearRegression()
    modelo.fit(X, y)
    prediccion_ventas = modelo.predict(np.array([[13]]))

    return prediccion_ventas[0]

# Graficar las ventas por mes y la regresión lineal para cada año
def graficar(datos_anuales, anio):
    datos_anuales['Mes'] = datos_anuales['Issue Date'].dt.month
    ventas_por_mes = datos_anuales.groupby('Mes')['Ventas'].sum().reset_index()
    X = ventas_por_mes[['Mes']]
    y = ventas_por_mes['Ventas']
    modelo = LinearRegression()
    modelo.fit(X, y)
    plt.scatter(X, y, color='blue')
    plt.plot(X, modelo.predict(X), color='red')
    plt.xlabel('Mes')
    plt.ylabel('Ventas')
    plt.title(f'Ventas por mes y regresión lineal ({anio})')
    plt.savefig(f'ventas_regresion_{anio}.png')
    plt.close()
    print(f"Gráfico guardado como ventas_regresion_{anio}.png")

#Limpiar datos
ventas_2023 = limpiar_datos(ventas_2023)
ventas_2024 = limpiar_datos(ventas_2024)
ventas_2025 = limpiar_datos(ventas_2025)

#Calcular ventas
ventas_2023 = calcular_ventas(ventas_2023)
ventas_2024 = calcular_ventas(ventas_2024)
ventas_2025 = calcular_ventas(ventas_2025)

# Unir los datos de ventas con los de la región utilizando el 'Customer ID'
ventas_x_region_2023 = pd.merge(ventas_2023, dimension_tables[['Customer ID', 'Region']], on='Customer ID', how='left')
ventas_x_region_2024 = pd.merge(ventas_2024, dimension_tables[['Customer ID', 'Region']], on='Customer ID', how='left')
ventas_x_region_2025 = pd.merge(ventas_2025, dimension_tables[['Customer ID', 'Region']], on='Customer ID', how='left')

# Calcular las ventas totales por región para cada año
ventas_totales_2023 = ventas_x_region_2023.groupby('Region')['Ventas'].sum().reset_index()
ventas_totales_2024 = ventas_x_region_2024.groupby('Region')['Ventas'].sum().reset_index()
ventas_totales_2025 = ventas_x_region_2025.groupby('Region')['Ventas'].sum().reset_index()

# Predecir las ventas del próximo mes para cada año
prediccion_ventas_2023 = predecir_ventas_siguiente_mes(ventas_2023)
prediccion_ventas_2024 = predecir_ventas_siguiente_mes(ventas_2024)
prediccion_ventas_2025 = predecir_ventas_siguiente_mes(ventas_2025)

# Mostrar las ventas totales por región
print(ventas_totales_2023)
print(ventas_totales_2024)
print(ventas_totales_2025)

# Mostrar las predicciones
print(f"Predicción de ventas para el próximo mes (2023): {prediccion_ventas_2023}")
print(f"Predicción de ventas para el próximo mes (2024): {prediccion_ventas_2024}")
print(f"Predicción de ventas para el próximo mes (2025): {prediccion_ventas_2025}")

# Graficar para cada año
graficar(ventas_2023, '2023')
graficar(ventas_2024, '2024')
graficar(ventas_2025, '2025')



