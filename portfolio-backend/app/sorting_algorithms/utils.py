def bubble_sort_steps(arr):
    """
    Bubble Sort
    """
    frames = []
    array = arr.copy() if arr else []
    n = len(array)
    
    # Always add initial frame
    frames.append({'array': array.copy()})
    
    for i in range(n):
        for j in range(0, n - i - 1):
            # Record comparison
            frames.append({
                'array': array.copy(),
                'highlight': {'type': 'compare', 'indices': [j, j + 1]},
                'sortedRange': [n - i, n - 1]
            })
            
            if array[j] > array[j + 1]:
                array[j], array[j + 1] = array[j + 1], array[j]
                frames.append({
                    'array': array.copy(),
                    'highlight': {'type': 'swap', 'indices': [j, j + 1]},
                    'sortedRange': [n - i, n - 1]
                })
        frames.append({'array': array.copy(), 'sortedRange': [n - 1 - i, n - 1]})
    
    return array, frames


def selection_sort_steps(arr):
    """
    Selection sort
    """
    frames = []
    array = arr.copy()
    n = len(array)
    
    frames.append({'array': array.copy()})
    
    for i in range(n):
        min_idx = i
        for j in range(i + 1, n):
            # Record comparison
            frames.append({
                'array': array.copy(),
                'highlight': {'type': 'compare', 'indices': [j, min_idx]},
                'sortedRange': [0, i - 1]
            })
            
            if array[j] < array[min_idx]:
                min_idx = j
        
        if min_idx != i:
            array[i], array[min_idx] = array[min_idx], array[i]
            frames.append({
                'array': array.copy(),
                'highlight': {'type': 'swap', 'indices': [i, min_idx]},
                'sortedRange': [0, i]
            })
        else:
            frames.append({'array': array.copy(), 'sortedRange': [0, i]})
    
    return array, frames


def insertion_sort_steps(arr):
    """
    Insertion Sort
    """
    frames = []
    array = arr.copy()
    
    frames.append({'array': array.copy()})
    
    for i in range(1, len(array)):
        key = array[i]
        j = i - 1
        
        frames.append({
            'array': array.copy(),
            'highlight': {'type': 'compare', 'indices': [j, i]},
            'sortedRange': [0, i - 1]
        })
        
        while j >= 0 and array[j] > key:
            array[j + 1] = array[j]
            frames.append({
                'array': array.copy(),
                'highlight': {'type': 'swap', 'indices': [j, j + 1]},
                'sortedRange': [0, i - 1]
            })
            j -= 1
        
        array[j + 1] = key
        frames.append({'array': array.copy(), 'sortedRange': [0, i]})
    
    return array, frames


def quick_sort_steps(arr):
    """
Quick sort.
    """
    frames = []
    array = arr.copy()
    
    frames.append({'array': array.copy()})
    
    def quicksort(low, high):
        if low < high:
            pi = partition(low, high)
            quicksort(low, pi - 1)
            quicksort(pi + 1, high)
    
    def partition(low, high):
        pivot = array[high]
        i = low - 1
        
        for j in range(low, high):
            frames.append({
                'array': array.copy(),
                'highlight': {'type': 'compare', 'indices': [j, high]}
            })
            if array[j] <= pivot:
                i += 1
                array[i], array[j] = array[j], array[i]
                frames.append({
                    'array': array.copy(),
                    'highlight': {'type': 'swap', 'indices': [i, j]}
                })
        
        array[i + 1], array[high] = array[high], array[i + 1]
        frames.append({
            'array': array.copy(),
            'highlight': {'type': 'swap', 'indices': [i + 1, high]}
        })
        return i + 1
    
    quicksort(0, len(array) - 1)
    frames.append({'array': array.copy(), 'sortedRange': [0, len(array) - 1]})
    return array, frames


def merge_sort_steps(arr):
    """
    Merge Sort
    """
    frames = []
    array = arr.copy()
    
    frames.append({'array': array.copy()})
    
    def merge_sort(left, right):
        if left < right:
            mid = (left + right) // 2
            merge_sort(left, mid)
            merge_sort(mid + 1, right)
            merge(left, mid, right)
    
    def merge(left, mid, right):
        left_arr = array[left:mid + 1]
        right_arr = array[mid + 1:right + 1]
        
        i = j = 0
        k = left
        
        while i < len(left_arr) and j < len(right_arr):
            frames.append({
                'array': array.copy(),
                'highlight': {'type': 'compare', 'indices': [left + i, mid + 1 + j]},
                'sortedRange': [left, right]
            })
            if left_arr[i] <= right_arr[j]:
                array[k] = left_arr[i]
                i += 1
            else:
                array[k] = right_arr[j]
                j += 1
            k += 1
            frames.append({
                'array': array.copy(),
                'highlight': {'type': 'swap', 'indices': [k - 1]},
                'sortedRange': [left, right]
            })
        
        while i < len(left_arr):
            array[k] = left_arr[i]
            i += 1
            k += 1
            frames.append({
                'array': array.copy(),
                'highlight': {'type': 'swap', 'indices': [k - 1]},
                'sortedRange': [left, right]
            })
        
        while j < len(right_arr):
            array[k] = right_arr[j]
            j += 1
            k += 1
            frames.append({
                'array': array.copy(),
                'highlight': {'type': 'swap', 'indices': [k - 1]},
                'sortedRange': [left, right]
            })
    
    merge_sort(0, len(array) - 1)
    frames.append({'array': array.copy(), 'sortedRange': [0, len(array) - 1]})
    return array, frames

import json
import os

_metadata_path = os.path.join(os.path.dirname(__file__), 'metadata.json')
with open(_metadata_path, 'r', encoding='utf-8') as f:
    _metadata = json.load(f)

ALGO_LABELS = _metadata['labels']
ALGO_INFO = _metadata['info']
ALGO_DESCRIPTIONS = _metadata['descriptions']

def parse_csv(input_str: str):
    """Parse CSV input and return array of numbers."""
    import re
    result = re.split(r'[\,\s]+', input_str.strip())
    numbers = []
    for item in result:
        if item:
            try:
                numbers.append(int(item))
            except ValueError:
                try:
                    numbers.append(float(item))
                except ValueError:
                    pass
    return numbers


def validate_array(arr):
    """Validate array before sorting."""
    if not isinstance(arr, list):
        return {"valid": False, "error": "Array must be a list"}
    if len(arr) == 0:
        return {"valid": False, "error": "Array cannot be empty"}
    if len(arr) > 1000:
        return {"valid": False, "error": "Array too large (max 1000)"}
    if not all(isinstance(n, (int, float)) and not isinstance(n, bool) for n in arr):
        return {"valid": False, "error": "All elements must be numbers"}
    return {"valid": True}
