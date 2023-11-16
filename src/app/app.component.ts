import { Component, OnInit } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { Category } from '../models/Category';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'SubCategoriesTask';

  treeControl : NestedTreeControl<Category>;
  dataSource : MatTreeNestedDataSource<Category>;

  constructor(private http: HttpClient) {
    this.treeControl = new NestedTreeControl<Category>(node => node.children);
    this.dataSource = new MatTreeNestedDataSource();
  }

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.http.get<Category[]>('https://localhost:7002/SubCategories')
    .subscribe({
      next: (data) => {
        this.dataSource.data = this.transformToTree(data);
      },
      error: (error) => {
        console.error('error: ', error);
      }
    });
  }

  hasChild = (_: number, node: Category) => !!node.children && node.children.length > 0;

  transformToTree(data: Category[]): Category[] {
    const tree: Category[] = [];
    const map = new Map<number, Category>();

    data.forEach(item => {
        const node: Category = { ...item, children: [] };
        map.set(node.categoryId, node);
    });

    data.forEach(item => {
        const node = map.get(item.categoryId);
        if (node) {
            if (item.parentCategoryId === null) {
                tree.push(node);
            } else {
                const parent = map.get(item.parentCategoryId);
                if (parent && parent.children) {
                    parent.children.push(node);
                }
            }
        }
    });

    return tree;
  }
}
