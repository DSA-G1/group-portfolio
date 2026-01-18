def bubble_sort_steps(arr):
    """
    Generate step-by-step visualization for bubble sort.
    Returns the sorted array and list of steps.
    """
    steps = []
    array = arr.copy()
    n = len(array)
    
    for i in range(n):
        for j in range(0, n - i - 1):
            # Record comparison
            steps.append({
                'type': 'compare',
                'indices': [j, j + 1],
                'array': array.copy()
            })
            
            if array[j] > array[j + 1]:
                array[j], array[j + 1] = array[j + 1], array[j]
                steps.append({
                    'type': 'swap',
                    'indices': [j, j + 1],
                    'array': array.copy()
                })
    
    return array, steps


def selection_sort_steps(arr):
    """
    Generate step-by-step visualization for selection sort.
    """
    steps = []
    array = arr.copy()
    n = len(array)
    
    for i in range(n):
        min_idx = i
        for j in range(i + 1, n):
            # Record comparison
            steps.append({
                'type': 'compare',
                'indices': [j, min_idx],
                'array': array.copy()
            })
            
            if array[j] < array[min_idx]:
                min_idx = j
        
        if min_idx != i:
            array[i], array[min_idx] = array[min_idx], array[i]
            steps.append({
                'type': 'swap',
                'indices': [i, min_idx],
                'array': array.copy()
            })
    
    return array, steps


def insertion_sort_steps(arr):
    """
    Generate step-by-step visualization for insertion sort.
    """
    steps = []
    array = arr.copy()
    
    for i in range(1, len(array)):
        key = array[i]
        j = i - 1
        
        while j >= 0 and array[j] > key:
            # Record comparison
            steps.append({
                'type': 'compare',
                'indices': [j, i],
                'array': array.copy()
            })
            
            array[j + 1] = array[j]
            steps.append({
                'type': 'swap',
                'indices': [j, j + 1],
                'array': array.copy()
            })
            j -= 1
        
        array[j + 1] = key
    
    return array, steps


def quick_sort_steps(arr):
    """
    Generate step-by-step visualization for quick sort.
    """
    steps = []
    
    def quicksort(array, low, high):
        if low < high:
            pi = partition(array, low, high)
            quicksort(array, low, pi - 1)
            quicksort(array, pi + 1, high)
    
    def partition(array, low, high):
        pivot = array[high]
        i = low - 1
        
        for j in range(low, high):
            if array[j] < pivot:
                i += 1
                array[i], array[j] = array[j], array[i]
                steps.append({
                    'type': 'swap',
                    'indices': [i, j],
                    'array': array.copy()
                })
        
        array[i + 1], array[high] = array[high], array[i + 1]
        steps.append({
            'type': 'swap',
            'indices': [i + 1, high],
            'array': array.copy()
        })
        return i + 1
    
    array = arr.copy()
    quicksort(array, 0, len(array) - 1)
    return array, steps


def merge_sort_steps(arr):
    """
    Generate step-by-step visualization for merge sort.
    """
    steps = []
    
    def merge_sort(array, left, right):
        if left < right:
            mid = (left + right) // 2
            merge_sort(array, left, mid)
            merge_sort(array, mid + 1, right)
            merge(array, left, mid, right)
    
    def merge(array, left, mid, right):
        left_arr = array[left:mid + 1]
        right_arr = array[mid + 1:right + 1]
        
        i = j = 0
        k = left
        
        while i < len(left_arr) and j < len(right_arr):
            if left_arr[i] <= right_arr[j]:
                array[k] = left_arr[i]
                i += 1
            else:
                array[k] = right_arr[j]
                j += 1
            k += 1
            steps.append({
                'type': 'merge',
                'array': array.copy()
            })
        
        while i < len(left_arr):
            array[k] = left_arr[i]
            i += 1
            k += 1
            steps.append({
                'type': 'merge',
                'array': array.copy()
            })
        
        while j < len(right_arr):
            array[k] = right_arr[j]
            j += 1
            k += 1
            steps.append({
                'type': 'merge',
                'array': array.copy()
            })
    
    array = arr.copy()
    merge_sort(array, 0, len(array) - 1)
    return array, steps
