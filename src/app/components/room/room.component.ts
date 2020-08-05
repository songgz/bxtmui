import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { RestService } from "../../services/rest.service";
import { DictService } from "../../services/dict.service";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Component({
  selector: "app-room",
  templateUrl: "./room.component.html",
  styleUrls: ["./room.component.scss"],
})
export class RoomComponent implements OnInit, AfterViewInit {
  displayedColumns = [
    "title",
    "total_beds",
    "vacant_beds",
    "updated_at",
    "action",
  ];
  dataSource: MatTableDataSource<any[]>;
  query: any = {};
  houses: Observable<any[]>;
  floors: Observable<any[]>;
  bed_stats: any = {};
  @ViewChild(MatPaginator, { read: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  pageIndex = 0;
  pageSize = 10;
  pageLength = 0;

  constructor(private rest: RestService, private dict: DictService) {
    this.dataSource = new MatTableDataSource([]);
  }

  ngOnInit() {
    if (sessionStorage.getItem("query")) {
      this.query = JSON.parse(sessionStorage.getItem("query"));
      this.pageSize = this.query.pre;
      this.pageIndex = this.query.page - 1;
    }
    // this.loadRooms();
    this.getHouses();
    // this.getFloors();
    this.getHouseId();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  paginate(event) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadRooms(this.query);
  }
  loadRooms(options = {}) {
    options["page"] = this.pageIndex + 1;
    options["pre"] = this.pageSize;
    this.rest.index("rooms", options).subscribe(
      (data: any) => {
        this.dataSource = new MatTableDataSource(data.result);
        this.dataSource.sort = this.sort;
        this.pageLength = data.paginate_meta.total_count;
        this.pageSize = data.paginate_meta.current_per_page;
        this.pageIndex = data.paginate_meta.current_page - 1;
        this.bed_stats = data.bed_stats;
      },
      (error) => {
        this.rest.errorHandle(error);
      }
    );
  }
  getHouses() {
    this.houses = this.rest.index("houses").pipe(map((res: any) => res.result));
  }

  getHouseId() {
    this.houses.subscribe((data) => {
      this.query.house_id = data[0].id;
      this.applyFilter();
    });
  }

  getFloors(houseId: string) {
    const options = {};
    options["parent_id"] = houseId;
    options['pre'] = 999;
    this.rest.index("floors", options).subscribe((data: any) => {
      this.floors = data.result;
    });
  }
  setFloor() {
    if (this.query.floor_id) {
      this.query.parent_id = this.query.floor_id;
      this.loadRooms(this.query);
    }
  }

  applyFilter() {
    if (this.query.house_id) {
      this.query.parent_id = this.query.house_id;
      this.getFloors(this.query.house_id);
    }
    this.loadRooms(this.query);
  }

  public update(id: string) {
    sessionStorage.setItem("query", JSON.stringify(this.query));
    this.rest.navigate(["/bxt/rooms/", id, "edit"]);
  }

  public delete(id: string) {
    this.rest
      .confirm({ title: "你确定要删除这条数据?" })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.rest.destory("rooms/" + id).subscribe(
            (data) => {
              this.loadRooms(this.query);
            },
            (error) => {
              this.rest.errorHandle(error);
            }
          );
        }
      });
  }
  public autorenew(id: string, mark: any, parent_id: any) {
    this.rest
      .update("rooms/" + id, {
        room: { parent_id: parent_id, mark: mark, title: mark, desc: mark, seq: Number(mark) },
      })
      .subscribe(
        (data) => {
          this.loadRooms(this.query);
        },
        (error) => {
          this.rest.errorHandle(error);
        }
      );
  }
  autorenewAll(id: any) {
    const options = {};
    options["house_id"] = id;
    options["page"] = 1;
    options["pre"] = 9999;
    this.rest.index("rooms", options).subscribe(
      (data: any) => {
        // this.floors = data.result;
        // console.log(data.result);
        data.result.map(item => {
          // console.log(item);
          this.rest
            .update("rooms/" + item.id, {
              room: { parent_id: item.parent_id, mark: item.mark, title: item.mark, desc: item.mark, seq: Number(item.mark) },
            })
            .subscribe(
              (data) => {
                this.loadRooms(this.query);
              },
              (error) => {
                this.rest.errorHandle(error);
              }
            );
        });
        this.loadRooms(this.query);
      },
      (error) => {
        this.rest.errorHandle(error);
      }
    );
  }
}
